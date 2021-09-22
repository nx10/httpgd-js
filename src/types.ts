/**
 * Access parameters to a httpgd server.
 */
export interface HttpgdBackend {
  host: string;
  token?: string;
}

/**
 * Defines the httpgd server state.
 */
export interface HttpgdStateResponse {
  upid: number;
  hsize: number;
  active: boolean;
}

/**
 * Plot ID object
 */
export interface HttpgdIdResponse {
  id: string;
}

/**
 * List of plot IDs
 */
export interface HttpgdPlotsResponse {
  state: HttpgdStateResponse;
  plots: HttpgdIdResponse[];
}

/**
 * Renderer meta information
 */
export interface HttpgdRendererResponse {
  id: string;
  mime: string;
  ext: string;
  name: string;
  type: string;
  bin: boolean;
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
  id?: string;
  renderer?: string;
  width?: number;
  height?: number;
  zoom?: number;
  download?: string;
}

/**
 * Remove request parameters
 */
export interface HttpgdRemoveRequest {
  id: string;
}
