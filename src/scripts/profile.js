import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { Input } from './components';
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

  onChange(field, value) {
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
        <Input
          className="border"
          defaultValue={form.name}
          label="Name"
          name="name"
          onChange={onChange}
          placeholder="Enter Your Name"
        />

        <label>Address</label>
        <textarea
          className="border"
          defaultValue={form.location}
          name="address"
          onChange={({ target: { value } }) => onChange('location', value)}
          placeholder="Enter Address"
        />
        <Input
          className="border"
          defaultValue={form.email}
          label="Email"
          name="email"
          onChange={onChange}
          placeholder="Enter Your Email"
          type="email"
        />
        <Input
          className="border"
          defaultValue={form.phone}
          label="Phone"
          name="phone"
          onChange={onChange}
          placeholder="Enter Your Phone Number"
        />
        <Input
          className="border"
          defaultValue={form.website}
          label="Website"
          name="website"
          placeholder="Enter Your Website"
          onChange={onChange}
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
          onChange={({ target: { value } }) => onChange('xpub', value)}
        />

        <small>
           Also, You can set a default Bitcoin Address for all those invoices that do not have an Bitcoin Address.
        </small>
        <Input
          className="border"
          defaultValue={form.address}
          name="address"
          placeholder="Enter Your Bitcoin Address..."
          onChange={onChange}
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
