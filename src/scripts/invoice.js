import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import InvoiceContainer from './containers/InvoiceContainer';

class InvoiceForm extends PureComponent {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = { value: {} };
  }

  onSubmit() {
    const { state: { value } } = this;
    console.log('onSubmit', value);
  }

  render() {
    const { onSubmit } = this;

    return (
      <InvoiceContainer
        onChange={(value) => this.setState({ value })}
        onSubmit={onSubmit}
      />
    );
  }
}

ReactDOM.render(<InvoiceForm />, document.getElementById('form'));
