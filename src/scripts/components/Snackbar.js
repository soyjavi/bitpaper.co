import { bool, string } from 'prop-types';
import React, { useState, useEffect } from 'react';

const Snackbar = ({ error, value }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (value) {
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    }

    return () => setVisible(false);
  }, [error, value]);

  return (
    <div className={`snackbar ${visible ? 'visible' : ''} ${error ? 'error' : ''}`}>
      <span>{value}</span>
    </div>
  );
};

Snackbar.propTypes = {
  error: bool,
  value: string,
};

Snackbar.defaultProps = {
  error: false,
  value: undefined,
};

export default Snackbar;
