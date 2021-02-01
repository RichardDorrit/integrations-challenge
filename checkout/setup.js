window.primer = {
  setup: () => {
    return new Promise((resolve, reject) => {
      fetch('/api/config')
        .then((res) => res.json())
        .then((data) => {
          const { clientId } = data;

          console.log('Loaded PayPal config: ', data);

          const url = `https://www.paypal.com/sdk/js?currency=EUR&client-id=${clientId}&intent=authorize&disable-funding=card,credit,bancontact`;
          const script = document.createElement('script');

          script.src = url;
          script.onload = () => {
            console.log('PayPal SDK loaded successfully');
            resolve();
          };
          script.onerror = (err) => {
            console.error('Failed to load PayPal SDK');
            console.error(err);
            reject(err);
          };

          console.log('Loadinng PayPal SDK:');
          document.body.appendChild(script);
        });
    });
  },
};
