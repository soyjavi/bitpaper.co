import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { Input, Snackbar } from './components';
import { fetch, Storage } from './modules';

const store = new Storage({ defaults: {}, filename: 'authorization' });

class FormRegister extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = { error: undefined, form: {} };
  }

  onChange(field, value) {
    let { state: { form } } = this;

    form = { ...form, [field]: value };
    form.username = form.username ? form.username.trim().replace(/\./g, '') : undefined;
    this.setState({ form, error: undefined });
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
    const { onChange, onSubmit, state: { error, form: { username, mnemonic = '' } } } = this;
    const valid = username && mnemonic.trim().split(' ').length === 12;

    return (
      <Fragment>
        <label>Username</label>
        <Input className="border" name="username" placeholder="Enter Your Username" onChange={onChange} />
        <label>
          Secret 12 word seed phrase
        </label>
        <textarea
          className="border"
          name="mnemonic"
          onChange={({ target: { value } }) => onChange('mnemonic', value)}
          placeholder="Enter Your 12 words"
        />

        <Snackbar value={error} error />

        <nav className="row space-between">
          <button type="button" disabled={!valid || error} onClick={onSubmit}>Login</button>
          <a href="/register" className="button secondary">Don&apos;t have an account?</a>
        </nav>
      </Fragment>
    );
  }
}

ReactDOM.render(<FormRegister />, document.getElementById('form'));
