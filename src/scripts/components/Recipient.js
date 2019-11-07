import { func, shape, string } from 'prop-types';
import React, { PureComponent } from 'react';

import Input from './Input';

class Recipient extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(key, value) {
    const { props: { dataSource, onChange } } = this;
    onChange({ ...dataSource, [key]: value });
  }

  render() {
    const {
      onChange,
      props: { dataSource = {}, label },
    } = this;

    return (
      <div>
        <label>{label}</label>
        <Input
          defaultValue={dataSource.name}
          name="name"
          onChange={onChange}
          placeholder="Your Name"
        />
        <textarea
          defaultValue={dataSource.location}
          name="address"
          onChange={({ target: { value } }) => onChange('location', value)}
          placeholder="Enter Address"
        />
        <Input
          defaultValue={dataSource.email}
          name="email"
          onChange={onChange}
          placeholder="Enter Email"
          type="email"
        />
        <Input
          defaultValue={dataSource.phone}
          name="phone"
          onChange={onChange}
          placeholder="Enter Phone"
          type="phone"
        />
      </div>
    );
  }
}

Recipient.propTypes = {
  dataSource: shape({}),
  label: string.isRequired,
  onChange: func.isRequired,
};

Recipient.defaultProps = {
  dataSource: {},
};

export default Recipient;
