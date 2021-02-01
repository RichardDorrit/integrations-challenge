import fetch, { RequestInit } from 'node-fetch';

export interface IHTTPRequest<T> {
  method: T;
  headers?: { [x: string]: string };
}

type HTTPRequest =
  | IHTTPRequest<'get'>
  | (IHTTPRequest<'post' | 'put' | 'patch'> & { body: string });

interface HTTPResponse {
  statusCode: number;
  responseText: string;
}

interface IHttpClient {
  request(url: string, options: HTTPRequest): Promise<HTTPResponse>;
}

const HTTPClient: IHttpClient = {
  async request(url, options) {
    const init: RequestInit = {
      method: options.method,
      headers: options.headers,
    };

    if (
      options.method === 'post' ||
      options.method === 'put' ||
      options.method === 'patch'
    ) {
      init.body = options.body;
    }

    const response = await fetch(url, init);
    const text = await response.text();

    return {
      statusCode: response.status,
      responseText: text,
    };
  },
};

export default HTTPClient;