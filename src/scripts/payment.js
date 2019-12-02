import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { fetch } from './modules';

const el = document.getElementById('payment-info');
let INTERVAL;

class Payment extends PureComponent {
  constructor(props) {
    super(props);
    this.onFetch = this.onFetch.bind(this);

    const invoice = el.getAttribute('data-invoice');

    this.state = { invoice, tx: undefined };

    if (invoice) {
      this.onFetch();
      INTERVAL = setInterval(this.onFetch, 1000 * 60);
    }
  }

  onFetch() {
    const { state: { invoice } } = this;

    fetch({ service: `/api/invoice/${invoice}/tx` })
      .then((tx) => {
        this.setState({ tx });
        clearInterval(INTERVAL);
      })
      .catch((error) => this.setState({ error }));
  }

  render() {
    const { state: { tx = {} } } = this;

    return (
      tx.id
        ? (
          <a href={`https://blockstream.info/tx/${tx.id}`} className="button success" target="_blank" rel="noopener noreferrer">
            Payment detected, More Info
          </a>
        )
        : <button type="button" disabled className="busy">Waiting for your payment</button>
    );
  }
}

ReactDOM.render(<Payment />, el);
