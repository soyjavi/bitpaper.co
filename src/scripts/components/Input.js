import { bool, func, string } from 'prop-types';
import React, { Fragment } from 'react';

const Input = ({
  busy, label, name, onChange, required, ...inherit
}) => (
  <Fragment>
    { label && <label>{label}</label> }
    <input
      {...inherit}
      name={name}
      onChange={({ target: { value } }) => onChange(name, value)}
    />
    { !busy && required && (!inherit.defaultValue || inherit.defaultValue.length === 0) && (
      <span className="tag">required</span>)}
    { busy && <span className="tag busy"></span> }
  </Fragment>
);

Input.propTypes = {
  busy: bool,
  label: string,
  name: string.isRequired,
  onChange: func.isRequired,
  required: bool,
};

Input.defaultProps = {
  busy: false,
  label: undefined,
  required: false,
};

export default Input;
