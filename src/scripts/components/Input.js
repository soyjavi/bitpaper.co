import { func, string } from 'prop-types';
import React from 'react';

const Input = ({ name, onChange, ...inherit }) => (
  <input
    {...inherit}
    name={name}
    onChange={({ target: { value } }) => onChange(name, value)}
  />
);

Input.propTypes = {
  name: string.isRequired,
  onChange: func.isRequired,
};

export default Input;
