# Connections - Processors

For this exercise you'll be implementing a Processor connection using Stripe's API

**Note:** you are required to **not** use Stripe's node SDK.

## Set up

You'll need to create an account with [Stripe](https://dashboard.stripe.com/login) and log in to the dashboard.
Once you've done that, you should be able to find an API Key in the developer section.

## Get stuck in

There are 4 parts to the exercise:

- Add your sandbox credentials to `Stripe.ts`
- Implement the `authorize()` method in `Stripe.ts`
- Implement the `capture()` method in `Stripe.ts`
- Implement the `cancel()` method in `Stripe.ts`

Feel free to tackle these in the order that makes most sense to you.

### Tips

- Check out Stripe's PaymentIntents API
- There is an `HTTPClient` implementation in `./common` that you may use, we've already imported it into `Stripe.ts` for you. Remember though, you can't use Stripe's SDK.
- If anything is unclear, Don't hesitate to reach out

## Run the example

To run the program use the following command:

```bash
yarn start:processors
```

Happy Coding :D

![Code](https://media.tenor.com/images/8460465dd4597849c320adfe461e91e3/tenor.gif)
