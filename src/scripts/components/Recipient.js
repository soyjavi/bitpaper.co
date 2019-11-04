import { func, shape, string } from 'prop-types';
import React, { PureComponent } from 'react';

class Recipient extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(key, { target: { value } }) {
    const { props: { dataSource, onChange } } = this;
    onChange({ ...dataSource, [key]: value });
  }

  render() {
    const {
      onChange,
      props: { dataSource = {}, key, label },
    } = this;

    return (
      <div>
        <label>{label}</label>
        <input
          defaultValue={dataSource.name}
          name={`${key}-name`}
          onChange={(event) => onChange('name', event)}
          placeholder="Your Name"
        />
        <textarea
          name={`${key}-address`}
          type="text"
          onChange={(event) => onChange('address', event)}
          placeholder="Enter Address"
        />
        <input
          name={`${key}-email`}
          type="email"
          onChange={(event) => onChange('email', event)}
          placeholder="Enter Email"
        />
        <input
          name={`${key}-phone`}
          type="phone"
          onChange={(event) => onChange('phone', event)}
          placeholder="Enter Phone"
        />
      </div>
    );
  }
}

Recipient.propTypes = {
  dataSource: shape({}).isRequired,
  label: string.isRequired,
  key: string,
  onChange: func.isRequired,
};

Recipient.defaultProps = {
  key: 'from',
};

export default Recipient;
