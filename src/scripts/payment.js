import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { fetch } from './modules';

const el = document.getElementById('payment-info');
let INTERVAL;

class Payment extends PureComponent {
  constructor(props) {
    super(props);
    this.onFetch = this.onFetch.bind(this);

    const invoice = el.getAttribute('data-invoice');

    this.state = { invoice, state: undefined };
    if (invoice) {
      this.onFetch();
      INTERVAL = setInterval(this.onFetch, 1000 * 60);
    }
  }

  onFetch() {
    const { state: { invoice } } = this;

    fetch({ service: `/api/transaction/${invoice}` })
      .then((response) => {
        console.log({ response });
      })
      .catch((error) => console.error({ error }));
  }

  render() {
    return (
      <Fragment>
        <button type="button" disabled className="busy">Waiting for your payment</button>
      </Fragment>
    );
  }
}

ReactDOM.render(<Payment />, el);
// <button type="button" class="bg-success">Payment received, click to continue</button>
