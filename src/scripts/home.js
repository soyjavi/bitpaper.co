import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import InvoiceForm from './containers/InvoiceForm';

class InvoiceDemo extends PureComponent {
  render() {
    return (
      <InvoiceForm />
    );
  }
}

ReactDOM.render(<InvoiceDemo />, document.getElementById('demo'));
