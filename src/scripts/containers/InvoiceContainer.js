import { bool, func } from 'prop-types';
import React, { PureComponent } from 'react';

import { C, calcTotal, priceFormat } from '../../common';
import { Input, Item, Recipient } from '../components';

const { CURRENCY, CURRENCIES, DATE_FORMATS } = C;

const [DATE_FORMAT] = DATE_FORMATS;

class InvoiceContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.onAddItem = this.onAddItem.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeCurrency = this.onChangeCurrency.bind(this);
    this.onChangeItem = this.onChangeItem.bind(this);
    this.onRemoveItem = this.onRemoveItem.bind(this);
    this.state = { dataSource: { currency: CURRENCY, dateFormat: DATE_FORMAT, items: [{}] } };
  }

  onAddItem() {
    const { state: { dataSource } } = this;
    this.setState({ dataSource: { ...dataSource, items: [...dataSource.items, {}] } });
  }

  onChangeItem(index, value) {
    const { onChange, state: { dataSource: { items = [] } } } = this;
    items[index] = value;
    onChange('items', items);
  }

  onChangeCurrency({ target: { value } }) {
    const { onChange } = this;

    const [currency] = value.split(' ');
    onChange('currency', currency);
  }

  onRemoveItem(index) {
    const { onChange } = this;
    let { state: { dataSource: { items = [] } } } = this;

    items = items.filter((item, i) => i !== index);
    if (items.length === 0) items = [{}];
    onChange('items', items);
  }

  onChange(key, value) {
    const { props: { onChange } } = this;
    let { state: { dataSource } } = this;

    dataSource = { ...dataSource, [key]: value };
    this.setState({ dataSource });
    onChange(dataSource);
  }

  render() {
    const {
      onAddItem, onChange, onChangeCurrency, onChangeItem, onRemoveItem,
      props: { demo, onSubmit },
      state: { dataSource: { currency, items, ...dataSource } },
    } = this;

    const total = calcTotal(items);

    return (
      <div className="invoice">
        <div className={`form ${!demo ? 'fixed' : ''}`}>
          <div className="fieldset border">
            <div className="row">
              <label>Invoice #</label>
              <Input name="reference" defaultValue={dataSource.reference} placeholder="001" onChange={onChange} />
            </div>

            <div className="row">
              <label>Issued:</label>
              <Input name="issued" type="date" onChange={onChange} />
              <label>Due:</label>
              <Input name="due" type="date" onChange={onChange} />
            </div>
          </div>

          <div className="fieldset border">
            <div>
              <label>Invoice</label>
              <input name="concept" type="text" placeholder="Concept of invoice" onChange={onchange} />
            </div>
            <div>
              <label>
                Bitcoin Address
                <a className="right color-accent" href="/profile">...or setup a XPUB</a>
              </label>
              <input name="address" type="text" placeholder="Bitcoin Address" onChange={onchange} />
            </div>
          </div>

          <div className="fieldset border">
            <Recipient dataSource={dataSource.from} label="Bill from" onChange={(value) => onChange('from', value)} />
            <Recipient dataSource={dataSource.to} label="Bill to" onChange={(value) => onChange('to', value)} />
          </div>

          <table className="border">
            <thead>
              <tr>
                <th>Item</th>
                <th className="right">Price</th>
                <th className="right">Qty</th>
                <th className="right">Total</th>
                <th className="center" />
              </tr>
            </thead>
            <tbody>
              { items.map((product, index) => (
                <Item
                  currency={currency}
                  key={index.toString()}
                  dataSource={product}
                  onChange={(value) => onChangeItem(index, value)}
                  onRemove={() => onRemoveItem(index)}
                />
              ))}
              <tr>
                <td>
                  <button onClick={onAddItem}>Add New Item</button>
                </td>
                <td colspan="4" />
              </tr>
            </tbody>
          </table>

          <div className="fieldset border">
            <div>
              <label>Notes</label>
              <textarea
                name="terms"
                placeholder="Enter Terms & Conditions"
                onChange={({ target: { value } }) => onChange('terms', value)}
              >
                {dataSource.terms}
              </textarea>
            </div>
            <div />
          </div>

          <div className="fieldset">
            <div />
            <div>
              <div className="row total">
                <label>Total</label>
                <strong>{priceFormat(total, currency)}</strong>
              </div>
              <div className="row total">
                <label>Total Bitcoin</label>
                <strong>{priceFormat(0, 'BTC')}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className={`options ${!demo ? 'fixed' : ''}`}>
          <button disabled={total <= 0} onClick={onSubmit}>Send Invoice</button>
          <div className="row">
            <button disabled={total <= 0} className="outlined">Preview</button>
            <button disabled={total <= 0} className="outlined">Download</button>
          </div>
          <div className="column">
            <label>Currency</label>
            <select className="border" onChange={onChangeCurrency}>
              { CURRENCIES.map((item, index) => <option key={index.toString()}>{item}</option>)}
            </select>
          </div>
          <div className="column">
            <label>Date Format</label>
            <select className="border" onChange={({ target: { value } }) => onChange('dateFormat', value)}>
              { DATE_FORMATS.map((item, index) => <option key={index.toString()}>{item}</option>)}
            </select>
          </div>
        </div>
      </div>
    );
  }
}

InvoiceContainer.propTypes = {
  demo: bool,
  onChange: func,
  onSubmit: func,
};

InvoiceContainer.defaultProps = {
  demo: false,
  onChange() {},
  onSubmit() {},
};

export default InvoiceContainer;
