import {
  HttpgdBackend,
  HttpgdStateResponse,
  HttpgdPlotsResponse,
  HttpgdRenderersResponse,
  HttpgdPlotRequest,
  HttpgdRemoveRequest
} from './types';
import WebSocket = require('isomorphic-ws');

const URL_HTTP = 'http://';
const URL_WS = 'ws://';
const URL_STATE = '/state';
const URL_CLEAR = '/clear';
const URL_REMOVE = '/remove';
const URL_PLOTS = '/plots';
const URL_PLOT = '/plot';
const URL_RENDERERS = '/renderers';
const HEADER_TOKEN = 'X-HTTPGD-TOKEN';

function make_headers(b: HttpgdBackend): Headers {
  const headers = new Headers();
  if (b.token) {
    headers.set(HEADER_TOKEN, b.token);
  }
  return headers;
}

async function fetch_json<ResponseType>(
  b: HttpgdBackend,
  url: string
): Promise<ResponseType> {
  const res = await fetch(url, {
    headers: make_headers(b)
  });
  return await (res.json() as Promise<ResponseType>);
}

/**
 * Get WebSocket URL.
 *
 * @param b Httpgd backend
 * @returns URL string
 */
export function url_websocket(b: HttpgdBackend): string {
  return URL_WS + b.host; // + (b.token ? ('&token='+b.token) : '');
}

/**
 * Creates a new WebSocket connection to an httpgd instance.
 *
 * @param b Httpgd backend
 * @returns WebSocket connection object
 */
export function new_websocket(b: HttpgdBackend): WebSocket {
  return new WebSocket(url_websocket(b));
}

/**
 * Get the URL of the `/state` API.
 *
 * @param b Httpgd backend
 * @returns URL string
 */
export function url_state(b: HttpgdBackend): string {
  return URL_HTTP + b.host + URL_STATE;
}

/**
 * Sends a GET-request to the `/state` API.
 *
 * @param b Httpgd backend
 * @returns Response promise
 */
export function fetch_state(b: HttpgdBackend): Promise<HttpgdStateResponse> {
  return fetch_json<HttpgdStateResponse>(b, url_state(b));
}

/**
 * Get the URL of the `/clear` API.
 *
 * @param b Httpgd backend
 * @returns URL string
 */
export function url_clear(b: HttpgdBackend): string {
  return URL_HTTP + b.host + URL_CLEAR;
}

/**
 * Sends a GET-request to the `/clear` API.
 *
 * @param b Httpgd backend
 * @returns Response promise
 */
export function fetch_clear(b: HttpgdBackend): Promise<HttpgdStateResponse> {
  return fetch_json<HttpgdStateResponse>(b, url_clear(b));
}

/**
 * Get the URL of the `/renderers` API.
 *
 * @param b Httpgd backend
 * @returns URL string
 */
export function url_renderers(b: HttpgdBackend): string {
  return URL_HTTP + b.host + URL_RENDERERS;
}

/**
 * Sends a GET-request to the `/clear` API.
 *
 * @param b Httpgd backend
 * @returns Response promise
 */
export function fetch_renderers(
  b: HttpgdBackend
): Promise<HttpgdRenderersResponse> {
  return fetch_json<HttpgdRenderersResponse>(b, url_renderers(b));
}

/**
 * Get the URL of the `/plots` API.
 *
 * @param b Httpgd backend
 * @returns URL string
 */
export function url_plots(b: HttpgdBackend): string {
  return URL_HTTP + b.host + URL_PLOTS;
}

/**
 * Sends a GET-request to the `/plots` API.
 *
 * @param b Httpgd backend
 * @returns Response promise
 */
export function fetch_plots(b: HttpgdBackend): Promise<HttpgdPlotsResponse> {
  return fetch_json<HttpgdPlotsResponse>(b, url_plots(b));
}

/**
 * Get the URL of the `/plot` API.
 *
 * @param b Httpgd backend
 * @param r Plot request object
 * @param includeToken In some cases token needs to be included in query params
 *   because request headers can't be set (e.g. img.src).
 * @param cachestr Convenience parameter will be added to the url as
 *   &c={cachestr} to circumvent caching.
 * @returns URL string
 */
export function url_plot(
  b: HttpgdBackend,
  r: HttpgdPlotRequest,
  includeToken?: boolean,
  cachestr?: string
): string {
  const url = new URL(URL_HTTP + b.host + URL_PLOT);
  if (r.id) url.searchParams.append('id', r.id);
  if (r.renderer) url.searchParams.append('renderer', r.renderer);
  if (r.width) url.searchParams.append('width', Math.round(r.width).toString());
  if (r.height)
    url.searchParams.append('height', Math.round(r.height).toString());
  if (r.zoom) url.searchParams.append('zoom', r.zoom.toString());
  if (r.download) url.searchParams.append('download', r.download);
  if (includeToken && b.token) url.searchParams.append('token', b.token);
  if (cachestr) url.searchParams.append('c', cachestr);
  return url.href;
}

/**
 * Sends a GET-request to the `/plot` API.
 *
 * @param b Httpgd backend
 * @param r Plot request object
 * @returns Response promise
 */
export function fetch_plot(
  b: HttpgdBackend,
  r: HttpgdPlotRequest
): Promise<Response> {
  const res = fetch(url_plot(b, r), {
    headers: make_headers(b)
  });
  return res;
}

/**
 * Get the URL of the `/remove` API.
 *
 * @param b Httpgd backend
 * @param r Remove request object
 * @returns URL string
 */
export function url_remove(b: HttpgdBackend, r: HttpgdRemoveRequest): string {
  const url = new URL(URL_HTTP + b.host + URL_REMOVE);
  url.searchParams.append('id', r.id);
  return url.href;
}

/**
 * Sends a GET-request to the `/remove` API.
 *
 * @param b Httpgd backend
 * @param r Remove request object
 * @returns Response promise
 */
export function fetch_remove(
  b: HttpgdBackend,
  r: HttpgdRemoveRequest
): Promise<HttpgdStateResponse> {
  return fetch_json<HttpgdStateResponse>(b, url_remove(b, r));
}
