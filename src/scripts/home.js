import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import InvoiceContainer from './containers/InvoiceContainer';

class InvoiceDemo extends PureComponent {
  render() {
    return (
      <InvoiceContainer demo />
    );
  }
}

ReactDOM.render(<InvoiceDemo />, document.getElementById('demo'));
