import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { fetch, Storage } from './modules';

const store = new Storage({ defaults: {}, filename: 'authorization' });

class FormRegister extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onCheckbox = this.onCheckbox.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = { error: undefined, form: { terms: true }, valid: false };
  }

  onChange(field, { target: { value } }) {
    let { state: { form } } = this;

    form = { ...form, [field]: value };
    form.username = form.username ? form.username.trim().replace(/\./g, '') : undefined;
    const {
      email, username, password, confirm, terms,
    } = form;

    this.setState({
      form,
      valid: (email && username && password && password === confirm && terms),
      error: undefined,
    });
  }

  onCheckbox(field, { currentTarget: { checked: value } }) {
    this.onChange(field, { target: { value } });
  }

  async onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    store.write({});

    const { state: { form } } = this;
    fetch({ service: 'api/signup', method: 'POST', ...form })
      .then((session) => {
        store.write(session);
        window.location = '/dashboard';
      })
      .catch((error) => this.setState({ error: error.message }));
  }

  render() {
    const {
      onChange, onCheckbox, onSubmit, state: { error, valid, form: { terms } },
    } = this;

    return (
      <Fragment>
        <label>Name</label>
        <input
          className="border"
          name="name"
          placeholder="Enter Your Name"
          onChange={(event) => onChange('name', event)}
        />
        <label>Username</label>
        <input
          className="border"
          name="username"
          placeholder="Enter Your Username"
          onChange={(event) => onChange('username', event)}
        />
        <label>Email</label>
        <input
          className="border"
          name="email"
          placeholder="Enter Your Email"
          onChange={(event) => onChange('email', event)}
        />
        <label>Password</label>
        <input
          className="border"
          name="password"
          type="password"
          placeholder="Enter Your Password"
          onChange={(event) => onChange('password', event)}
        />
        <label>Confirm Password</label>
        <input
          className="border"
          name="confirm"
          type="password"
          placeholder="Confirm Your Password"
          onChange={(event) => onChange('confirm', event)}
        />
        <div className="row">
          <input
            className="border"
            type="checkbox"
            checked={terms}
            name="terms"
            onChange={(event) => onCheckbox('terms', event)}
          />
          <label>
            By signing up you agree with
            <a target="_blank" className="color-accent" href="/terms"> terms of use </a>
             and
            <a target="_blank" className="color-accent" href="/privacy"> privacy policy</a>
            .
          </label>
        </div>

        <div className="row">
          <input
            className="border"
            type="checkbox"
            name="newsletter"
            onChange={(event) => onCheckbox('newsletter', event)}
          />
          <label>
            Yes, please keep me updated about News and Features.
          </label>
        </div>

        { error && (
          <p className="error row">
            <strong>ERROR:</strong>
            {error}
          </p>
        )}

        <nav className="row space-between">
          <button disabled={!valid || error} onClick={onSubmit}>Sign Up</button>
          <a className="button secondary" href="/login">Already have an account?</a>
        </nav>
      </Fragment>
    );
  }
}

ReactDOM.render(<FormRegister />, document.getElementById('form'));
