import { bool, func, shape } from 'prop-types';
import React, { PureComponent } from 'react';

import { C, calcTotal, priceFormat } from '../../common';
import Input from './Input';
import Item from './Item';
import Recipient from './Recipient';
import Options from './InvoiceOptions';

const { CURRENCY, DATE_FORMATS: [DATE_FORMAT] } = C;

class InvoiceContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.onAddItem = this.onAddItem.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeItem = this.onChangeItem.bind(this);
    this.onRemoveItem = this.onRemoveItem.bind(this);
    this.state = { dataSource: { currency: CURRENCY, dateFormat: DATE_FORMAT, items: [{}] } };
  }

  componentWillReceiveProps({ dataSource = {} }) {
    const { state } = this;
    if (dataSource.id && state.dataSource.id !== dataSource.id) this.setState({ dataSource });
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
      state: { dataSource },
    } = this;
    const { currency, items } = dataSource;

    const total = calcTotal(items);

    return (
      <div className="invoice">
        <section className="form">
          <div className="fieldset border">
            <div className="row">
              <label>Invoice #</label>
              <Input name="reference" defaultValue={dataSource.reference} placeholder="001" onChange={onChange} />
            </div>

            <div className="row">
              <label>Issued:</label>
              <Input name="issued" defaultValue={dataSource.issued} type="date" onChange={onChange} />
              <label>Due:</label>
              <Input name="due" defaultValue={dataSource.due} type="date" onChange={onChange} />
            </div>
          </div>

          <div className="fieldset border">
            <div>
              <label>Invoice</label>
              <Input
                name="concept"
                defaultValue={dataSource.concept}
                placeholder="Concept of invoice"
                onChange={onChange}
              />
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
                  <button type="button" onClick={onAddItem}>Add New Item</button>
                </td>
                <td colSpan="4" />
              </tr>
            </tbody>
          </table>

          <div className="fieldset border">
            <div>
              <label>Notes</label>
              <textarea
                name="terms"
                defaultValue={dataSource.terms}
                placeholder="Enter Terms & Conditions"
                onChange={({ target: { value } }) => onChange('terms', value)}
              />
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
