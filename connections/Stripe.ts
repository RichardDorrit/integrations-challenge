import {
  APIKeyCredentials,
  CardDetails,
  IAuthResponse,
  ParsedAuthorizationResponse,
  ParsedCancelResponse,
  ParsedCaptureResponse,
  ProcessorConnection,
  RawAuthorizationRequest,
  RawCancelRequest,
  RawCaptureRequest,
  RawCreatePaymentMethodRequest,
  RawCreatePaymentIntentRequest,
  TransactionStatus,
} from '@primer-io/app-framework';

import HTTPClient, {IHTTPRequest} from '../common/HTTPClient';

const StripeConnection: ProcessorConnection<APIKeyCredentials, CardDetails> = {
  name: 'STRIPE',

  website: 'stripe.com',

  configuration: {
    accountId: 'acct_1IFJDxAqeOxgQwxT',
    apiKey: 'sk_test_51IFJDxAqeOxgQwxTeoCRWC2lUySFB36FVQxaLaqQ844FaWptkSaFUCHeE1jLmtZ1m7s7KbRShKcdDw7jeWWiUtNT00vtsuUBni',
  },

  /**
   *
   * You should authorize a transaction and return an appropriate response
   */
  async authorize(
    request: RawAuthorizationRequest<APIKeyCredentials, CardDetails>,
  ): Promise<ParsedAuthorizationResponse> {

    // step 1: Create a payment method using given card details and get the payment id to create a payment intent in step 2.
    var paymentMethodId = await CreatePaymentMethod(request);


    // step 2: Create a payment intent using paymentMethod id from above and set capture method to manual for next test.
    var paymentIntentId = await CreatePaymentIntent(request, paymentMethodId);


    // step 3: Confirm/Authorize a payment intent to move the status to "require_capture".
    var ConfirmPaymentIntentUrl = `https://api.stripe.com/v1/payment_intents/${paymentIntentId}/confirm`;
    var ConfirmPaymentIntentRequestDetail: IHTTPRequest<'post'> & {body} ={
      method: 'post',
      headers: {"Authorization":`Bearer ${request.processorConfig.apiKey}`, "Content-Type":"application/x-www-form-urlencoded"},
      body: null,
    };
    var confirmPaymentIntentResponse = await HTTPClient.request(ConfirmPaymentIntentUrl, ConfirmPaymentIntentRequestDetail);
    var jsonResponse = JSON.parse(confirmPaymentIntentResponse.responseText);

    if(confirmPaymentIntentResponse.statusCode==200){
    var successfulResult:IAuthResponse<{processorTransactionId}, "AUTHORIZED"> = {
      transactionStatus: "AUTHORIZED",
      processorTransactionId:JSON.parse(confirmPaymentIntentResponse.responseText)["id"],
      }
    return successfulResult;
    }
    else if(confirmPaymentIntentResponse.statusCode.toString()[0]=="4"){
      var declinedResult:IAuthResponse<{declineReason}, "DECLINED"> = {
        transactionStatus: "DECLINED",
        declineReason:jsonResponse["error"]["decline_code"]=="do_not_honor"?"DO_NOT_HONOR":jsonResponse["error"]["decline_code"]=="insufficient_funds"?"INSUFFICIENT_FUNDS":"UNKNOWN",
        }
      return declinedResult;
    }else{
      var failedresult:IAuthResponse<{errorMessage}, "FAILED"> = {
        transactionStatus: "FAILED",
        errorMessage:confirmPaymentIntentResponse.responseText,
        }
      return failedresult;
    }
  },

  /**
   * Capture a payment intent
   * This method should capture the funds on an authorized transaction
   */
  async capture(
    request: RawCaptureRequest<APIKeyCredentials>,
  ): Promise<ParsedCaptureResponse> {
    var url = `https://api.stripe.com/v1/payment_intents/${request.processorTransactionId}/capture`;
    var requestDetail: IHTTPRequest<'post'> & {body} ={
      method:'post',
      headers: {"Authorization":`Bearer ${request.processorConfig.apiKey}`, "Content-Type":"application/x-www-form-urlencoded"},
      body: null,
    };
    var response = await HTTPClient.request(url, requestDetail);
    var result: ParsedCaptureResponse = {
      transactionStatus: response.statusCode==200?"SETTLED":"FAILED",
      errorMessage: response.statusCode==200?null as any:JSON.parse(response.responseText)["error"]["message"],
    }
    return result;
    },

  /**
   * Cancel a payment intent
   * This one should cancel an authorized transaction
   */
  async cancel(
    request: RawCancelRequest<APIKeyCredentials>,
  ): Promise<ParsedCancelResponse> {
    var url = `https://api.stripe.com/v1/payment_intents/${request.processorTransactionId}/cancel`;
    var requestDetail: IHTTPRequest<'post'> & {body} ={
      method:'post',
      headers: {"Authorization":`Bearer ${request.processorConfig.apiKey}`, "Content-Type":"application/x-www-form-urlencoded"},
      body: null,
    };
    var response = await HTTPClient.request(url, requestDetail);
    var result : ParsedCancelResponse = {
      transactionStatus: response.statusCode==200?"CANCELLED":"FAILED",
      errorMessage: response.statusCode==200?null as any:JSON.parse(response.responseText)["error"]["message"],
    }
    return result;
  },
};

async function CreatePaymentMethod(
  request: RawCreatePaymentMethodRequest<APIKeyCredentials, CardDetails>,
){
  var paymentUrl = "https://api.stripe.com/v1/payment_methods";
  const paymentBodyRequest = `type=card&card[number]=${request.paymentMethod.cardNumber}&card[exp_month]=${request.paymentMethod.expiryMonth}&card[exp_year]=${request.paymentMethod.expiryYear}&card[cvc]=${request.paymentMethod.cvv}`;
  var createPaymentMethodRequest: IHTTPRequest<'post'> & {body} ={
    method:'post',
    headers: {"Authorization":`Bearer ${request.processorConfig.apiKey}`, "Content-Type":"application/x-www-form-urlencoded"},
    body: paymentBodyRequest,
  };
  var paymentResponse = await HTTPClient.request(paymentUrl, createPaymentMethodRequest);
  return JSON.parse(paymentResponse.responseText)["id"];
}

async function CreatePaymentIntent(
  request: RawCreatePaymentIntentRequest<APIKeyCredentials, CardDetails>, paymentId: string,
){
  var CreatePaymentIntentUrl = "https://api.stripe.com/v1/payment_intents";
  const CreatePaymentIntentBodyRequest = `amount=${request.amount}&currency=${request.currencyCode}&payment_method=${paymentId}&capture_method=manual`
  var CreatePaymentIntentRequestDetail: IHTTPRequest<'post'> & {body} ={
    method:'post',
    headers: {"Authorization":`Bearer ${request.processorConfig.apiKey}`, "Content-Type":"application/x-www-form-urlencoded"},
    body: CreatePaymentIntentBodyRequest,
  };
  var createPaymentIntentResponse = await HTTPClient.request(CreatePaymentIntentUrl, CreatePaymentIntentRequestDetail);
  return JSON.parse(createPaymentIntentResponse.responseText)["id"];
}

export default StripeConnection;
