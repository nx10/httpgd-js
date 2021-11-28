/**
 * Access parameters to a httpgd server.
 */
export interface HttpgdBackend {
  /**
   * Host without protocol
   */
  host: string;
  /**
   * Security token
   */
  token?: string;
}

/**
 * Defines the httpgd server state.
 */
export interface HttpgdStateResponse {
  /**
   * Changes when plots are changed or added
   */
  upid: number;
  /**
   * Number of plots
   */
  hsize: number;
  /**
   * Device active status
   */
  active: boolean;
}

/**
 * Defines the httpgd server state.
 */
export interface HttpgdInfoResponse {
  /**
   * Unique server ID
   */
  id: number;
  /**
   * Httpgd and library version information
   */
  version: {
    /**
     * Httpgd version
     */
    httpgd: string;
    /**
     * Boost version
     */
    boost: string;
    /**
     * Cairo version
     */
    cairo: string;
  };
}

/**
 * Plot ID type
 */
export type HttpgdPlotId = string;

/**
 * Plots response ID object
 */
export interface HttpgdIdResponse {
  id: HttpgdPlotId;
}

/**
 * List of plot IDs
 */
export interface HttpgdPlotsResponse {
  state: HttpgdStateResponse;
  plots: HttpgdIdResponse[];
}

/**
 * Renderer ID type
 */
export type HttpgdRendererId = string;

/**
 * Renderer type type
 */
export type HttpgdRendererType = 'plot' | 'data';

/**
 * Renderer meta information
 */
export interface HttpgdRendererResponse {
  /**
   * Renderer ID
   */
  id: HttpgdRendererId;
  /**
   * Mime type
   */
  mime: string;
  /**
   * File extension
   */
  ext: string;
  /**
   * Human readable name
   */
  name: string;
  /**
   * Renderer type
   */
  type: HttpgdRendererType;
  /**
   * Binary rendering format. (`TRUE` = binary; `FALSE` = string)
   */
  bin: boolean;
  /**
   * Renderer description
   */
  descr: string;
}

/**
 * List of renderers
 */
export interface HttpgdRenderersResponse {
  renderers: HttpgdRendererResponse[];
}

/**
 * Plot request parameters
 */
export interface HttpgdPlotRequest {
  id?: HttpgdPlotId;
  renderer?: HttpgdRendererId;
  width?: number;
  height?: number;
  zoom?: number;
  download?: string;
}

/**
 * Remove request parameters
 */
export interface HttpgdRemoveRequest {
  id: HttpgdPlotId;
}
