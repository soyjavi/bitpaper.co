import {
  bool, func, number, shape,
} from 'prop-types';
import React, { Fragment, PureComponent } from 'react';

import { C } from '../../common';
import { fetch } from '../modules';

const { CURRENCIES, DATE_FORMATS, STATE } = C;
const SYMBOLS = CURRENCIES.map((item) => item.split(' ')[0]);

class InvoiceContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.onChangeCurrency = this.onChangeCurrency.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onChangeCurrency({ target: { value } }) {
    const { props: { onChange } } = this;

    const [currency] = value.split(' ');
    onChange('currency', currency);
  }

  onDelete() {
    const { props: { dataSource: { id } } } = this;
    fetch({ service: `/api/invoice/${id}`, method: 'DELETE' }).then(() => { window.location = '/'; });
  }

  render() {
    const {
      onChangeCurrency, onDelete,
      props: {
        busy, demo, onChange, onPreview, onSend, onSubmit, total,
        dataSource: {
          id, currency, dateFormat, reference = '', state,
        },
      },
    } = this;

    const isValid = total > 0 && reference.length > 0;
    let buttonLabel = id ? 'Save Changes' : 'Create Invoice';
    if (busy) buttonLabel = 'Please wait';

    return (
      <section className="options">
        <div className="columns">
          { !demo && (
            <Fragment>
              <button type="button" disabled={busy || !isValid} className={busy ? 'busy' : undefined} onClick={onSubmit}>
                {buttonLabel}
              </button>
              { state === STATE.DRAFT && (
                <button type="button" className="secondary" disabled={busy} onClick={onSend}>
                  Publish Invoice
                </button>
              )}
            </Fragment>
          )}

          <div className="row">
            <button type="button" disabled={busy || (!demo && !id)} className="outlined" onClick={onPreview}>
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

          { !demo && state !== STATE.CONFIRMED && (
            <button type="button" className="secondary" onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      </section>
    );
  }
}

InvoiceContainer.propTypes = {
  busy: bool,
  dataSource: shape({}),
  demo: bool,
  onChange: func,
  onPreview: func,
  onSend: func,
  onSubmit: func,
  total: number,
};

InvoiceContainer.defaultProps = {
  busy: false,
  dataSource: undefined,
  demo: false,
  onChange() {},
  onPreview() {},
  onSend() {},
  onSubmit() {},
  total: undefined,
};

export default InvoiceContainer;
