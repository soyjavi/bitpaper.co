import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { Input } from './components';
import { fetch, Storage } from './modules';

const store = new Storage({ defaults: {}, filename: 'authorization' });
let timeout;

class FormRegister extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onCheckbox = this.onCheckbox.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      busy: false, error: undefined, form: { terms: true }, valid: false,
    };
  }

  onChange(field, value) {
    let { state: { form } } = this;

    form = { ...form, [field]: value };
    form.username = form.username ? form.username.trim().replace(/\./g, '') : undefined;
    this.setState({ error: undefined, form });

    if (field !== 'username') return;

    this.setState({ busy: true });
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      const { exists } = await fetch({ service: `api/search?username=${form.username}` })
        .catch((error) => this.setState({ busy: false, error: error.message }));

      const { state: { form: { username, terms } } } = this;
      this.setState({
        busy: false,
        error: exists ? 'Username already in use.' : undefined,
        valid: username && terms && !exists,
      });
    }, 500);
  }

  onCheckbox(field, { currentTarget: { checked: value } }) {
    this.onChange(field, value);
  }

  async onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    store.write({});

    const { state: { form } } = this;
    fetch({ service: 'api/signup', method: 'POST', ...form })
      .then((session) => {
        store.write(session);
        window.location = '/';
      })
      .catch((error) => this.setState({ error: error.message }));
  }

  render() {
    const {
      onChange, onCheckbox, onSubmit,
      state: {
        busy, error, valid, form: { terms },
      },
    } = this;

    return (
      <Fragment>
        <label>Username</label>
        <Input
          busy={busy}
          className="border"
          name="username"
          onChange={onChange}
          placeholder="Enter Your Username"
          required
        />
        <label>Name</label>
        <Input className="border" name="name" placeholder="Enter Your Name" onChange={onChange} />
        <label>Email</label>
        <Input className="border" name="email" placeholder="Enter Your Email" onChange={onChange} />
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

        { error && (
          <p className="error row">
            <strong>ERROR:</strong>
            {error}
          </p>
        )}

        <nav className="row space-between">
          <button type="button" disabled={busy || !valid || error} onClick={onSubmit}>Sign Up</button>
          <a className="button secondary" href="/login">Already have an account?</a>
        </nav>
      </Fragment>
    );
  }
}

ReactDOM.render(<FormRegister />, document.getElementById('form'));
