import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { Input, Snackbar } from './components';
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
      busy: false, error: undefined, form: { terms: true }, mnemonic: undefined, valid: false,
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
      .then(({ authorization, mnemonic, username }) => {
        store.write({ authorization, username });
        this.setState({ mnemonic });
      })
      .catch((error) => this.setState({ error: error.message }));
  }

  render() {
    const {
      onChange, onCheckbox, onSubmit,
      state: {
        busy, error, form: { terms }, mnemonic, valid,
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

        { mnemonic && (
          <div className="mnemonic">
            <h3>Secret Backup Phrase</h3>
            <p>
              Your secret backup phrase makes it easy to restore your account in another device.
              <strong> WARNING: </strong>
              Never disclose your backup phrase. Here you have some tips:
              <ul className="color-lighten">
                <li>Store this phrase in a password manager like 1Password.</li>
                <li>Write this phrase on a piece of paper and store in a secure location.</li>
                <li>Memorize this phrase.</li>
              </ul>
            </p>

            <div className="row words">
              { mnemonic.split(' ').map((word) => <span>{word}</span>)}
            </div>

            <a className="button anchor" href="/">Already save my phrase</a>
          </div>
        )}

        <Snackbar value={error} error />

        { !mnemonic && (
          <nav className="row space-between">
            <button type="button" disabled={busy || !valid || error} onClick={onSubmit}>Sign Up</button>
            <a className="button secondary" href="/login">Already have an account?</a>
          </nav>
        )}

      </Fragment>
    );
  }
}

ReactDOM.render(<FormRegister />, document.getElementById('form'));
