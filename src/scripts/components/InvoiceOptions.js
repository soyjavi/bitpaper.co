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
    this.onPublish = this.onPublish.bind(this);
    this.state = { busy: undefined };
  }

  onChangeCurrency({ target: { value } }) {
    const { props: { onChange } } = this;

    const [currency] = value.split(' ');
    onChange('currency', currency);
  }

  onDelete() {
    const { props: { dataSource: { id } } } = this;

    this.setState({ busy: true });
    fetch({ service: `/api/invoice/${id}`, method: 'DELETE' }).then(() => { window.location = '/'; });
  }

  onPublish() {
    const { props: { dataSource: { from = {}, to = {}, ...dataSource } } } = this;

    const props = {
      ...dataSource,
      state: STATE.PUBLISHED,
      from: { ...from, location: from.location ? from.location.split('\n') : undefined },
      to: { ...to, location: to.location ? to.location.split('\n') : undefined },
    };

    this.setState({ busy: true });
    fetch({ service: `/api/invoice/${dataSource.id}`, method: 'PUT', ...props })
      .then(() => { window.location = '/'; })
      .catch((error) => this.setState({ busy: undefined, error }));
  }

  render() {
    const {
      onChangeCurrency, onDelete, onPublish,
      props: {
        demo, onChange, onPreview, onSubmit, total,
        dataSource: {
          address = '', id, currency, dateFormat, reference = '', state, withoutAddress,
        },
        ...props
      },
    } = this;
    const { state: { busy = props.busy } } = this;

    const isValid = total > 0 && reference.length > 0 && (!withoutAddress || (withoutAddress && address.length >= 34));
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
                <button type="button" className="secondary" disabled={busy || !isValid} onClick={onPublish}>
                  Publish Invoice
                </button>
              )}
            </Fragment>
          )}

          { (demo || id) && (
            <div className="row">
              <button type="button" disabled={busy || (!demo && !id)} className="outlined" onClick={onPreview}>
                Preview
              </button>
              <button type="button" disabled className="outlined">
                Download
              </button>
            </div>
          )}
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

          { id && state !== STATE.CONFIRMED && (
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
  onSubmit: func,
  total: number,
};

InvoiceContainer.defaultProps = {
  busy: false,
  dataSource: undefined,
  demo: false,
  onChange() {},
  onPreview() {},
  onSubmit() {},
  total: undefined,
};

export default InvoiceContainer;
