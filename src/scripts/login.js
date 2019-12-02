import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { Input } from './components';
import { fetch, Storage } from './modules';

const store = new Storage({ defaults: {}, filename: 'authorization' });

class FormRegister extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = { error: undefined, form: { terms: true }, valid: false };
  }

  onChange(field, { target: { value } }) {
    let { state: { form } } = this;

    form = { ...form, [field]: value };
    form.username = form.username ? form.username.trim().replace(/\./g, '') : undefined;
    const { username, password } = form;

    this.setState({ form, valid: (username && password), error: undefined });
  }

  async onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    store.write({});

    const { state: { form } } = this;
    fetch({ service: 'api/login', method: 'POST', ...form })
      .then((session) => {
        store.write(session);
        window.location = '/';
      })
      .catch((error) => this.setState({ error: error.message }));
  }

  render() {
    const { onChange, onSubmit, state: { error, valid } } = this;

    return (
      <Fragment>
        <label>Username</label>
        <input
          className="border"
          name="username"
          placeholder="Enter Your Username"
          onChange={(event) => onChange('username', event)}
        />
        <label>
          Import your existing wallet using a 12 word seed phrase
        </label>
        <input
          className="border"
          name="mnemonic"
          type="mnemonic"
          placeholder="Enter Your Password"
          onChange={(event) => onChange('mnemonic', event)}
        />

        <div className={`snackbar error ${error ? 'visible' : ''}`}>
          <span>{error}</span>
        </div>

        <nav className="row space-between">
          <button type="button" disabled={!valid || error} onClick={onSubmit}>Login</button>
          <a href="/register" className="button secondary">Don&apos;t have an account?</a>
        </nav>
      </Fragment>
    );
  }
}

ReactDOM.render(<FormRegister />, document.getElementById('form'));
