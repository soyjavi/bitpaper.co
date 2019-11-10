import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { fetch } from './modules';
import InvoiceContainer from './components/InvoiceContainer';

class InvoiceForm extends PureComponent {
  constructor(props) {
    super(props);
    this.onPreview = this.onPreview.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    const id = document.getElementsByTagName('body')[0].getAttribute('data-id');
    const isNew = id === 'new';

    this.state = {
      busy: !isNew, error: undefined, id: !isNew ? id : undefined, value: {},
    };
  }

  componentDidMount() {
    const { state: { id } } = this;

    if (id) {
      fetch({ service: `/api/invoice/${id}` })
        .then(({ from = {}, to = {}, ...response }) => {
          this.setState({
            busy: false,
            value: {
              ...response,
              from: { ...from, location: from.location ? from.location.join('\n') : undefined },
              to: { ...to, location: to.location ? to.location.join('\n') : undefined },
            },
          });
        })
        .catch((error) => this.setState({ busy: false, error }));
    }
  }

  onPreview() {
    const { state: { id } } = this;

    window.location = `/invoice/${id}/preview`;
  }

  async onSubmit() {
    const { state: { id, value: { from, to, ...value } } } = this;
    const newValue = {
      ...value,
      from: { ...from, location: from.location ? from.location.split('\n') : undefined },
      to: { ...to, location: to.location ? to.location.split('\n') : undefined },
    };

    this.setState({ busy: true });

    const method = id ? 'PUT' : 'POST';
    const service = id ? `/api/invoice/${id}` : '/api/invoice';

    const invoice = await fetch({ service, method, ...newValue })
      .catch((error) => this.setState({ error }));

    this.setState({ busy: false });
    if (!id) window.location = `/invoice/${invoice.id}`;
  }

  render() {
    const { onPreview, onSubmit, state: { busy, error, value } } = this;

    return (
      <InvoiceContainer
        busy={busy}
        dataSource={value}
        error={error}
        onChange={(newValue) => this.setState({ value: newValue })}
        onPreview={onPreview}
        onSubmit={onSubmit}
      />
    );
  }
}

ReactDOM.render(<InvoiceForm />, document.getElementById('form'));
