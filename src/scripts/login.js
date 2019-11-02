import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';

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

    this.setState({ form, valid: (username && password), error: undefined, });
  }

  async onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    store.write({});

    const { state: { form } } = this;
    fetch({ service: 'api/login', method: 'POST', ...form })
      .then((session) => {
        store.write(session);
        window.location = '/dashboard';
      })
      .catch((error) => this.setState({ error: error.message }));
  }

  render() {
    const { onChange, onSubmit, state: { error, valid } } = this;

    return (
      <Fragment>
        <label>Username</label>
        <input
          name="username"
          placeholder="Enter Your Username"
          onChange={(event) => onChange('username', event)}
        />
        <label>
          Password
          <a className="right color-accent" href="/email/remember">Forgot password?</a>
        </label>
        <input
          name="password"
          type="password"
          placeholder="Enter Your Password"
          onChange={(event) => onChange('password', event)}
        />

        { error && (
          <p className="error row">
            <strong>ERROR:</strong>
            {error}
          </p>
        )}

        <nav className="row space-between">
          <button disabled={!valid || error} onClick={onSubmit}>Login</button>
          <a href="/register" class="button secondary">Don't have an account?</a>
        </nav>
      </Fragment>
    );
  }
}

ReactDOM.render(<FormRegister />, document.getElementById('form'));
