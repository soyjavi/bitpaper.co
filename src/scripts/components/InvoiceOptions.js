import {
  bool, func, number, shape,
} from 'prop-types';
import React, { PureComponent } from 'react';

import { C } from '../../common';

const { CURRENCIES, DATE_FORMATS, STATE } = C;
const SYMBOLS = CURRENCIES.map((item) => item.split(' ')[0]);

class InvoiceContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.onChangeCurrency = this.onChangeCurrency.bind(this);
  }

  onChangeCurrency({ target: { value } }) {
    const { props: { onChange } } = this;

    const [currency] = value.split(' ');
    onChange('currency', currency);
  }

  render() {
    const {
      onChangeCurrency,
      props: {
        busy, onChange, onPreview, onSend, onSubmit, total,
        dataSource: {
          id, currency, dateFormat, state,
        },
      },
    } = this;

    const disabled = total <= 0 || busy;
    let buttonLabel = id ? 'Save Changes' : 'Create Invoice';
    if (busy) buttonLabel = 'Please wait';

    return (
      <section className="options">
        <div className="columns">
          <button type="button" disabled={disabled} className={busy ? 'busy' : undefined} onClick={onSubmit}>
            {buttonLabel}
          </button>
          { state === STATE.DRAFT && (
            <button
              type="button"
              className="secondary"
              disabled={disabled}
              onClick={onSend}
            >
              Send Invoice
            </button>
          )}
          <div className="row">
            <button type="button" disabled={disabled} className="outlined" onClick={onPreview}>
              Preview
            </button>
            <button type="button" disabled className="outlined">
              Download
            </button>
          </div>
          <div className="column">
            <label>Currency</label>
            <select className="border" onChange={onChangeCurrency} value={currency}>
              { SYMBOLS.map((item, index) => <option value={item} key={item}>{CURRENCIES[index]}</option>)}
            </select>
          </div>
          <div className="column">
            <label>Date Format</label>
            <select
              value={dateFormat}
              className="border"
              onChange={({ target: { value } }) => onChange('dateFormat', value)}
            >
              { DATE_FORMATS.map((item, index) => (
                <option value={item} key={index.toString()}>{item}</option>))}
            </select>
          </div>
        </div>
      </section>
    );
  }
}

InvoiceContainer.propTypes = {
  busy: bool,
  dataSource: shape({}),
  onChange: func,
  onPreview: func,
  onSend: func,
  onSubmit: func,
  total: number,
};

InvoiceContainer.defaultProps = {
  busy: false,
  dataSource: undefined,
  onChange() {},
  onPreview() {},
  onSend() {},
  onSubmit() {},
  total: undefined,
};

export default InvoiceContainer;
