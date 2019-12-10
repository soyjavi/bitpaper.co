import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { fetch } from './modules';
import InvoiceContainer from './components/InvoiceContainer';

const el = document.getElementById('form');

class InvoiceForm extends PureComponent {
  constructor(props) {
    super(props);
    this.onPreview = this.onPreview.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    const id = document.getElementsByTagName('body')[0].getAttribute('data-id');
    const withoutAddress = el.getAttribute('data-without-address') === 'true';

    this.state = {
      busy: false,
      error: undefined,
      id: id !== 'new' ? id : undefined,
      value: { withoutAddress },
    };
  }

  componentDidMount() {
    const { onError, state: { id } } = this;

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
        .catch(onError);
    }
  }

  onPreview() {
    const { state: { id } } = this;
    window.location = `/${id}`;
  }

  onError(error) {
    this.setState({ busy: false, error });
    console.error({ error });
  }

  async onSubmit() {
    const { onError, state: { id, value: { from, to, ...value } } } = this;
    const newValue = {
      ...value,
      from: { ...from, location: from.location ? from.location.split('\n') : undefined },
      to: { ...to, location: to.location ? to.location.split('\n') : undefined },
    };

    this.setState({ busy: true });

    const method = id ? 'PUT' : 'POST';
    const service = id ? `/api/invoice/${id}` : '/api/invoice';

    const invoice = await fetch({ service, method, ...newValue }).catch(onError);

    this.setState({ busy: false });
    if (!id) window.location = `/invoice/${invoice.id}`;
  }

  render() {
    const {
      onError, onPreview, onSubmit, state: { busy, value },
    } = this;

    return (
      <Fragment>
        <InvoiceContainer
          busy={busy}
          dataSource={value}
          onChange={(newValue) => this.setState({ value: newValue })}
          onError={onError}
          onPreview={onPreview}
          onSubmit={onSubmit}
        />
      </Fragment>
    );
  }
}

ReactDOM.render(<InvoiceForm />, el);
