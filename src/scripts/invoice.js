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

  onSubmit() {
    const { state: { id, value } } = this;
    const newValue = {
      ...value,
      from: { ...value.from, location: value.from.location.split('\n') },
      to: { ...value.to, location: value.to.location.split('\n') },
    };

    this.setState({ busy: true });

    fetch({ service: '/api/invoice', method: id ? 'PUT' : 'POST', ...newValue })
      .then((invoice) => {
        if (!id) window.location = `/invoice/${invoice.id}`;
      })
      .catch((error) => this.setState({ error }));

    this.setState({ busy: false });
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
