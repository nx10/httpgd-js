import {
  fetch_clear,
  fetch_plot,
  fetch_plots,
  fetch_remove,
  fetch_renderers,
  url_plot
} from './api';
import { HttpgdConnection } from './connection';
import {
  HttpgdBackend,
  HttpgdIdResponse,
  HttpgdPlotRequest,
  HttpgdPlotsResponse,
  HttpgdRemoveRequest,
  HttpgdRendererResponse,
  HttpgdRenderersResponse,
  HttpgdStateResponse
} from './types';
import { StateChangeListener } from './utils';

interface HttpgdData {
  renderers?: HttpgdRenderersResponse;
  plots?: HttpgdPlotsResponse;
}

/**
 * Manages httpgd connection and API access.
 */
export class Httpgd {
  private backend: HttpgdBackend;
  private connection: HttpgdConnection;
  private data: HttpgdData;

  private plotsChanged: StateChangeListener<HttpgdPlotsResponse> =
    new StateChangeListener();
  private deviceActiveChanged: StateChangeListener<boolean> =
    new StateChangeListener();

  /**
   * Setup httpgd backend and connection.
   *
   * Note that Httpgd.connect() needs to be called after to open the connection
   * and start listening for remote changes.
   *
   * @param host Httpgd host
   * @param token Security token
   * @param allowWebsockets Allow WebSocket connection
   */
  constructor(host: string, token?: string, allowWebsockets?: boolean) {
    this.data = {};
    this.backend = { host: host, token: token };
    this.connection = new HttpgdConnection(this.backend, allowWebsockets);
    this.connection.onRemoteChanged((newState, oldState?) =>
      this.remoteStateChanged(newState, oldState)
    );
  }

  /**
   * Open the connection to the httpgd backend.
   *
   * This will also cause a renderer list update and return a promise that will
   * be resolved once the renderers are updated.
   *
   * @returns Promise that will be resolved once the renderers are updated.
   */
  public connect(): Promise<void> {
    this.connection.open();
    return this.updateRenderers();
  }

  /**
   * Disconnect httpgd backend.
   */
  public disconnect(): void {
    this.connection.close();
  }

  /**
   * Listen to connection changes.
   *
   * A connection change occurs when the server goes offline or the connection
   * is interrupted.
   *
   * @param fun
   */
  public onConnectionChanged(
    fun: (newState: boolean, oldState?: boolean) => void
  ): void {
    this.connection.onConnectionChanged(fun);
  }

  private remoteStateChanged(
    newState: HttpgdStateResponse,
    oldState?: HttpgdStateResponse
  ) {
    if (
      !oldState ||
      oldState.hsize !== newState.hsize ||
      oldState.upid !== newState.upid
    ) {
      this.updatePlots();
    }
    if (!oldState || oldState.active != newState.active) {
      this.deviceActiveChanged.notify(newState.active);
    }
  }

  private localStateChanged(newState: HttpgdStateResponse) {
    this.remoteStateChanged(newState, this.data.plots?.state);
  }

  private updateRenderers(): Promise<void> {
    return fetch_renderers(this.backend).then((res) => {
      this.data.renderers = res;
    });
  }

  /**
   * Update plot ID list data.
   */
  public updatePlots(): void {
    fetch_plots(this.backend).then((res) => {
      this.data.plots = res;
      this.plotsChanged.notify(res);
    });
  }

  /**
   * Get plot ID list.
   *
   * @returns
   */
  public getPlots(): HttpgdIdResponse[] {
    return this.data.plots ? this.data.plots.plots : [];
  }

  /**
   * Get renderer list.
   *
   * @returns
   */
  public getRenderers(): HttpgdRendererResponse[] {
    return this.data.renderers ? this.data.renderers.renderers : [];
  }

  /**
   * Get the URL of a plot.
   *
   * @param r Plot request object.
   * @returns URL string
   */
  public getPlotURL(r: HttpgdPlotRequest): string | undefined {
    return this.data.plots
      ? url_plot(this.backend, r, true, this.data.plots.state.upid.toString())
      : undefined;
  }

  /**
   * Get rendered plot data.
   *
   * @param r Plot request object.
   * @returns Plot data
   */
  public getPlot(r: HttpgdPlotRequest): Promise<Response> | undefined {
    return this.data.plots ? fetch_plot(this.backend, r) : undefined;
  }

  /**
   * Listen to plot changes.
   *
   * Plot changes occur when a plot changes or a new plot is added remotely in
   * the R session.
   */
  public onPlotsChanged(
    fun: (newState: HttpgdPlotsResponse, oldState?: HttpgdPlotsResponse) => void
  ): void {
    this.plotsChanged.subscribe(fun);
  }

  /**
   * Listen to device active changes.
   *
   * The R GraphicsDevice becomes inactive when a other graphics device is
   * created remotely in the R session.
   *
   * @param fun
   */
  public onDeviceActiveChanged(
    fun: (newState: boolean, oldState?: boolean) => void
  ): void {
    this.deviceActiveChanged.subscribe(fun);
  }

  /**
   * Remove a specific plot.
   *
   * @param r Remove request object
   */
  public removePlot(r: HttpgdRemoveRequest): void {
    fetch_remove(this.backend, r).then((state) =>
      this.localStateChanged(state)
    );
  }

  /**
   * Clear all plots.
   */
  public clearPlots(): void {
    fetch_clear(this.backend).then((state) => this.localStateChanged(state));
  }
}
