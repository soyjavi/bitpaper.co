import { bool, func, string } from 'prop-types';
import React from 'react';

const Input = ({
  label, name, onChange, required, ...inherit
}) => (
  <>
    { label && <label>{label}</label> }
    <input
      {...inherit}
      name={name}
      onChange={({ target: { value } }) => onChange(name, value)}
    />
    { required && (!inherit.defaultValue || inherit.defaultValue.length === 0) && (
      <span className="required">required</span>)}
  </>
);

Input.propTypes = {
  label: string,
  name: string.isRequired,
  onChange: func.isRequired,
  required: bool,
};

Input.defaultProps = {
  label: undefined,
  required: false,
};

export default Input;
