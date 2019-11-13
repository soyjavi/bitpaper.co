import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { fetch } from './modules';

class FormProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = { error: undefined, form: {}, info: undefined };
  }

  componentDidMount() {
    fetch({ service: '/api/profile' })
      .then(({ location = [], ...profile }) => {
        this.setState({ form: { ...profile, location: location.join('\n') } });
      });
  }

  onChange(field, { target: { value } }) {
    let { state: { form } } = this;

    form = { ...form, [field]: value };
    if (form.xpub) form.address = '';
    this.setState({ form, error: undefined, info: undefined });
  }

  async onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const { state: { form } } = this;

    fetch({
      service: 'api/profile',
      method: 'PUT',
      ...form,
      location: form.location ? form.location.split('\n') : [],
    })
      .then(() => this.setState({ info: 'Changes saved correctly' }))
      .catch((error) => this.setState({ error: error.message }));
  }

  render() {
    const { onChange, onSubmit, state: { error, form, info } } = this;

    return (
      <Fragment>
        <label>Name</label>
        <input
          className="border"
          defaultValue={form.name}
          name="name"
          placeholder="Enter Your Name"
          onChange={(event) => onChange('name', event)}
        />
        <label>Address</label>
        <textarea
          className="border"
          defaultValue={form.location}
          name="address"
          onChange={(event) => onChange('location', event)}
          placeholder="Enter Address"
        />
        <label>Phone</label>
        <input
          className="border"
          defaultValue={form.phone}
          name="phone"
          placeholder="Enter Your Phone Number"
          onChange={(event) => onChange('phone', event)}
        />
        <label>Website</label>
        <input
          className="border"
          defaultValue={form.website}
          name="website"
          placeholder="Enter Your Website"
          onChange={(event) => onChange('website', event)}
        />

        <label>
          Bitcoin Address
          <a href="http://google.com" target="_blank" rel="noopener noreferrer" className="color-accent right">
            How can I get my Xpub?
          </a>
        </label>

        <small>
          You can set your XPub Address so that each of the invoices has an automatic and unique public address.
          We strongly recommend using XPub addresses as much as possible.
        </small>
        <textarea
          className="border"
          defaultValue={form.xpub}
          name="xpub"
          placeholder="... or Enter Your Bitcoin XPUB"
          onChange={(event) => onChange('xpub', event)}
        />

        <small>
           Also, You can set a default Bitcoin Address for all those invoices that do not have an Bitcoin Address.
        </small>
        <input
          className="border"
          defaultValue={form.address}
          name="address"
          placeholder="Enter Your Bitcoin Address..."
          onChange={(event) => onChange('address', event)}
        />

        <div className={`snackbar ${info || error ? 'visible' : ''} ${error ? 'error' : ''}`}>
          <span>{info || error}</span>
        </div>

        <nav className="row space-between">
          <button type="button" disabled={error} onClick={onSubmit}>Save changes</button>
          <a className="button secondary" href="/">Return to dashboard</a>
        </nav>
      </Fragment>
    );
  }
}

ReactDOM.render(<FormProfile />, document.getElementById('form'));