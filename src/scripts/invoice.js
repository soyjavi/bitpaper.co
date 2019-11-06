import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { fetch } from './modules';
import InvoiceContainer from './containers/InvoiceContainer';

class InvoiceForm extends PureComponent {
  constructor(props) {
    super(props);
    this.onPreview = this.onPreview.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    const id = document.getElementsByTagName('body')[0].getAttribute('data-id');
    this.state = {
      busy: id !== 'new', error: undefined, id, value: {},
    };
  }

  componentDidMount() {
    const { state: { id } } = this;
    if (id) {
      fetch({ service: `/api/invoice/${id}` })
        .then((dataSource) => this.setState({ busy: false, dataSource }))
        .catch((error) => this.setState({ busy: false, error }));
    }
  }

  onPreview() {
    const { state: { id } } = this;

    window.location = `/invoice/preview/${id}`;
  }

  onSubmit() {
    const { state: { value } } = this;

    this.setState({ busy: true });

    fetch({ service: '/api/invoice', method: 'POST', ...value })
      .then((invoice) => {
        window.location = `/invoice/${invoice.id}`;
      })
      .catch((error) => this.setState({ error }));

    this.setState({ busy: false });
  }

  render() {
    const { onPreview, onSubmit, state: { busy, error, dataSource } } = this;

    return (
      <InvoiceContainer
        busy={busy}
        dataSource={dataSource}
        error={error}
        onChange={(value) => this.setState({ value })}
        onPreview={onPreview}
        onSubmit={onSubmit}
      />
    );
  }
}

ReactDOM.render(<InvoiceForm />, document.getElementById('form'));
