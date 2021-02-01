# Checkout - Payment Methods

For this exercise you'll be implementing a Processor connection using PayPal's REST API and also tackling some of the client side implementation on the web.

## Set up

You'll need to log in to [PayPal's developer site](https://developer.paypal.com/home/) and create a sandbox account.
Once you've done that, you should be able to find an _Application_ with a client ID and client Secret.

For the client side log in, you'll need to create a sandbox test user as well. You can find them in the Sandbox > [Accounts](https://developer.paypal.com/developer/accounts/) section of the dashboard.

## Get stuck in

There are 4 parts to the exercise:

Backend:

- Add your sandbox credentials to `PayPal.ts`
- Implement the `authorize()` method in `PayPal.ts`
- Implement the `cancel()` method in `PayPal.ts`

Client Side:

- Complete the implementation of `renderPayPalButton()` in `client.js`

Feel free to tackle these in the order that makes most sense to you.

### Tips

- In the backend we've provided a `HTTPClient` implementation which you can use to make API calls to PayPal's orders API
- Check out PayPal's orders API and client SDK documentation
- Once a transaction has been authorized, you should be able to cancel it using the 'Cancel Transaction' button.
- Don't forget to log in to PayPal using the test account which you created!
- If anything is unclear, Don't hesitate to reach out

## Run the example

To run the program use the following command:

```bash
yarn start:payment-methods
```

and your browser should open at `http://localhost:4444`

Happy Coding :D

![Code](https://media.tenor.com/images/8460465dd4597849c320adfe461e91e3/tenor.gif)
