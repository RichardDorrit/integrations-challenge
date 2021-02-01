import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as opn from 'opn';
import PayPal from './PayPal';

const PORT = 4444;

const server = express();

server.use(express.static(__dirname));
server.use(bodyParser.json());

const router = express.Router();

router.get('/config', (req, res) => res.send(PayPal.configuration));

router.post('/authorize', async (req, res) => {
  const response = await PayPal.authorize({
    amount: 1299,
    currencyCode: 'EUR',
    processorConfig: PayPal.configuration,
    paymentMethod: {
      orderId: req.body.orderId,
    },
  });

  return res.send(response);
});

router.post('/capture', async (req, res) => {
  const response = await PayPal.capture({
    processorTransactionId: req.body.orderId,
    processorConfig: PayPal.configuration,
  });

  return res.send(response);
});

router.post('/cancel', async (req, res) => {
  const response = await PayPal.cancel({
    processorTransactionId: req.body.orderId,
    processorConfig: PayPal.configuration,
  });

  return res.send(response);
});

server.use('/api', router);

server.listen(PORT, () => {
  console.log(`Server listening on *:${PORT}`);
  opn(`http://localhost:${PORT}`);
});
