import { bool, func, shape } from 'prop-types';
import React, { PureComponent } from 'react';

import {
  C, calcTotal, exchange, formatPrice,
} from '../../common';
import Input from './Input';
import Item from './Item';
import Recipient from './Recipient';
import Options from './InvoiceOptions';

const { CURRENCY, DATE_FORMATS: [DATE_FORMAT] } = C;
const DEFAULT_DATASOURCE = {
  currency: CURRENCY, dateFormat: DATE_FORMAT, items: [{}], from: {}, to: {}, withoutAddress: true,
};

class InvoiceContainer extends PureComponent {
  constructor(props) {
    super(props);

    const rates = document.getElementById('rates')
      ? JSON.parse(document.getElementById('rates').innerHTML)
      : {};

    this.onAddItem = this.onAddItem.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeItem = this.onChangeItem.bind(this);
    this.onRemoveItem = this.onRemoveItem.bind(this);
    this.state = { dataSource: { ...DEFAULT_DATASOURCE, ...props.dataSource }, rates };
  }

  componentWillReceiveProps({ dataSource = {} }) {
    const { state } = this;
    // @TODO: Why?
    if (dataSource.id && state.dataSource.id !== dataSource.id) {
      this.setState({ dataSource });
    }
  }

  // @TODO
  // static getDerivedStateFromError(error) {
  //   // Update state so the next render will show the fallback UI.
  //   return { hasError: true };
  // }

  onAddItem() {
    const { state: { dataSource } } = this;
    this.setState({ dataSource: { ...dataSource, items: [...dataSource.items, {}] } });
  }

  onChangeItem(index, value) {
    const { onChange, state: { dataSource: { items = [] } } } = this;
    items[index] = value;
    onChange('items', items);
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
    let { state: { dataSource = {} } } = this;

    dataSource = { ...dataSource, [key]: value };
    this.setState({ dataSource });

    onChange(dataSource);
  }

  render() {
    const {
      onAddItem, onChange, onChangeItem, onRemoveItem,
      props,
      state: { dataSource, rates },
    } = this;
    const { currency, items } = dataSource;
    const total = calcTotal(items);

    return (
      <div className="invoice">
        <section className="form">
          <div className="fieldset border">
            <div className="row">
              <Input
                defaultValue={dataSource.reference}
                label="Invoice #"
                name="reference"
                onChange={onChange}
                placeholder="001"
                required
              />
            </div>

            <div className="row">
              <Input
                defaultValue={dataSource.issued}
                label="Issued:"
                name="issued"
                onChange={onChange}
                type="date"
              />
              <Input defaultValue={dataSource.due} label="Due:" name="due" type="date" onChange={onChange} />
            </div>
          </div>

          <div className="fieldset border">
            <div>
              <Input
                defaultValue={dataSource.concept}
                label="Invoice"
                name="concept"
                onChange={onChange}
                placeholder="Concept of invoice"
              />
            </div>
            <div>
              <label>
                Bitcoin Address
                <a className="right color-accent" href="/profile">...or setup a XPUB</a>
              </label>
              <Input
                defaultValue={dataSource.address}
                name="address"
                onChange={onChange}
                placeholder="Bitcoin Address"
                required={dataSource.withoutAddress}
              />
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
                  required={index === 0 && (!product.name || product.name.length === 0)}
                />
              ))}
              <tr>
                <td>
                  <button type="button" onClick={onAddItem}>Add New Item</button>
                </td>
                <td colSpan="4" />
              </tr>
            </tbody>
          </table>

          <div className="fieldset border">
            <div className="expand">
              <label>Notes</label>
              <textarea
                defaultValue={dataSource.terms}
                name="terms"
                onChange={({ target: { value } }) => onChange('terms', value)}
                placeholder="Enter Terms & Conditions"
              />
            </div>
          </div>

          <div className="fieldset">
            <div />
            <div>
              <div className="row total">
                <label>Total</label>
                <strong>{formatPrice(total, currency)}</strong>
              </div>
              <div className="row total">
                <label>Total Bitcoin</label>
                <strong>{formatPrice(exchange(total, currency, rates), 'BTC')}</strong>
              </div>
            </div>
          </div>
        </section>

        <Options {...props} dataSource={dataSource} onChange={onChange} total={total} />
      </div>
    );
  }
}

InvoiceContainer.propTypes = {
  busy: bool,
  dataSource: shape({}),
  onChange: func,
  onPreview: func,
  onSubmit: func,
};

InvoiceContainer.defaultProps = {
  busy: false,
  dataSource: undefined,
  onChange() {},
  onPreview() {},
  onSubmit() {},
};

export default InvoiceContainer;
