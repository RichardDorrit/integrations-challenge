import {
  ParsedAuthorizationResponse,
  ParsedCancelResponse,
  ParsedCaptureResponse,
} from '@primer-io/app-framework';
import StripeConnection from './Stripe';

(async () => {
  console.log('\n=== TEST: authorization ===');
  await testAuthTransaction();
  console.log('\n=== TEST: capture ===');
  await testCaptureTransaction();
  console.log('\n=== TEST: cancel ===');
  await testCancelTransaction();
})();

async function testAuthTransaction(): Promise<ParsedAuthorizationResponse> {
  console.log(`Authorizing payment using "${StripeConnection.name}"`);

  let response: ParsedAuthorizationResponse | null = null;

  try {
    response = await StripeConnection.authorize({
      processorConfig: StripeConnection.configuration,
      amount: 1000,
      currencyCode: 'GBP',
      paymentMethod: {
        expiryMonth: 4,
        expiryYear: 2022,
        cardholderName: 'Mr Foo Bar',
        cvv: '020',
        cardNumber: '4111111111111111',
        // cardNumber: '4000000000009995'   to test declined case with insufficient_funds
        // cardNumber: '4000000000000101'   to test declined case with unknown
        // can't find the cardNumber to test declined case with do_not_honor
      },
    });
  } catch (e) {
    console.error('Error while authorizing transaction:');
    console.error(e);
    console.log('=== TEST: authorization === Failed ===\n')
    process.exit(1);
  }

  console.log(
    `Authorization request complete: "${response.transactionStatus}"`,
  );

  if (response.transactionStatus === 'FAILED') {
    console.log(`Authorization Request failed: ${response.errorMessage}`);
    console.log('=== TEST: authorization === Failed ===\n')
    process.exit(1);
  }

  if (response.transactionStatus === 'DECLINED') {
    console.log(`Authorization was declined: ${response.declineReason}`);
    console.log('=== TEST: authorization === Failed ===\n')
    process.exit(1);
  }

  console.log('=== TEST: authorization === PASS ===\n')
  return response;
}

async function testCancelTransaction(): Promise<void> {
  const authResponse = await testAuthTransaction();

  console.log('Cancelling authorized payment...');

  if (authResponse.transactionStatus !== 'AUTHORIZED') {
    console.error('Transaction must be AUTHORIZED in order to cancel it');
    console.log('=== TEST: cancel === FAILED ===\n')
    process.exit(1);
  }

  let response: ParsedCancelResponse | null = null;

  try {
    response = await StripeConnection.cancel({
      processorTransactionId: authResponse.processorTransactionId,
      processorConfig: StripeConnection.configuration,
    });
  } catch (e) {
    console.error('Error while cancelling transaction:');
    console.error(e);
    console.log('=== TEST: cancel === FAILED ===\n')
    process.exit(1);
  }

  if (response.transactionStatus !== 'CANCELLED') {
    console.error(
      `Expected transaction status to be "CANCELLED" but received "${response.transactionStatus}"`,
    );
    console.log('=== TEST: cancel === FAILED ===\n')
  }else{
  console.log('=== TEST: cancel === PASS ===\n')
  }
}

async function testCaptureTransaction(): Promise<void> {
  const authResponse = await testAuthTransaction();

  console.log('Capturing authorized payment...');

  if (authResponse.transactionStatus !== 'AUTHORIZED') {
    console.error('Transaction must be AUTHORIZED in order to capture it');
    console.log('=== TEST: capture === FAILED ===\n')
    process.exit(1);
  }

  let response: ParsedCaptureResponse | null = null;

  try {
    response = await StripeConnection.capture({
      processorTransactionId: authResponse.processorTransactionId,
      processorConfig: StripeConnection.configuration,
    });
  } catch (e) {
    console.error('Error while capturing transaction:');
    console.error(e);
    console.log('=== TEST: capture === FAILED ===\n')
    process.exit(1);
  }

  if (response.transactionStatus !== 'SETTLED') {
    console.error(
      `Expected transaction status to be "SETTLED" but received "${response.transactionStatus}"`,
    );
  console.log('=== TEST: capture === FAILED ===\n')
  }else{
  console.log('=== TEST: capture === PASS ===\n')
  }
}
