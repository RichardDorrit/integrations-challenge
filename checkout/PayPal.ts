import {
  ClientIDSecretCredentials,
  ParsedAuthorizationResponse,
  ParsedCaptureResponse,
  PayPalOrder,
  ProcessorConnection,
  RawAuthorizationRequest,
  RawCancelRequest,
  RawCaptureRequest,
} from '@primer-io/app-framework';

/**
 * Use the HTTP Client to make requests to PayPal's orders API
 */
import HTTPClient from '../common/HTTPClient';

const PayPalConnection: ProcessorConnection<
  ClientIDSecretCredentials,
  PayPalOrder
> = {
  name: 'PAYPAL',

  website: 'https://paypal.com',

  configuration: {
    accountId:
      '... Paste something here that uniquely identifies the PayPal account',
    clientId: '...Paste your sandbox PayPal client ID here...',
    clientSecret: '...Paste your sandbox PayPal client secret here...',
  },

  /**
   * Authorize a PayPal order
   * Use the HTTPClient and the request info to authorize a paypal order
   */
  authorize(
    request: RawAuthorizationRequest<ClientIDSecretCredentials, PayPalOrder>,
  ): Promise<ParsedAuthorizationResponse> {
    throw new Error('Not Implemented');
  },

  /**
   * Cancel a PayPal order
   * Use the HTTPClient and the request information to cancel the PayPal order
   */
  cancel(
    request: RawCancelRequest<ClientIDSecretCredentials>,
  ): Promise<ParsedCaptureResponse> {
    throw new Error('Not Implemented');
  },

  /**
   * Capture a PayPal order (You can ignore this method for the exercise)
   */
  capture(
    request: RawCaptureRequest<ClientIDSecretCredentials>,
  ): Promise<ParsedCaptureResponse> {
    throw new Error('Not Implemented');
  },
};

export default PayPalConnection;
