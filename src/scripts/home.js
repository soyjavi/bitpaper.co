import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { price } from '../common';
import { ProductItem, Recipient } from './components';

const CURRENCIES = [
  'USD (United States Dollar)',
  'EUR (Euro Member Countries)',
  'GBP (United Kingdom Pound)',
  'JPY (Japan Yen)',
  'BTC (Bitcoin)',
];

const DATE_FORMATS = ['DD/MM/YYYY', 'YYYY/MM/DD', 'MM/DD/YYYY'];

class InvoiceDemo extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onAddItem = this.onAddItem.bind(this);
    this.state = { dataSource: { items: [{}] } };
  }

  onAddItem() {
    const { state: { dataSource } } = this;
    this.setState({ dataSource: { ...dataSource, items: [...dataSource.items, {}] } });
  }

  onChange(key, value) {
    const { state: { dataSource } } = this;

    this.setState({ dataSource: { ...dataSource, [key]: value } });
    // onChange({ ...dataSource, [key]: value });
  }

  render() {
    const { onAddItem, onChange, state: { dataSource } } = this;

    console.log(dataSource);

    return (
      <div className="invoice">
        <div className="form">
          <div className="fieldset border">
            <div className="row">
              <label>Invoice #</label>
              <input name="reference" type="text" placeholder="001" />
            </div>

            <div className="row">
              <label>Issued:</label>
              <input name="reference" type="date" placeholder="001" />
              <label>Due:</label>
              <input name="reference" type="date" placeholder="001" />
            </div>
          </div>

          <div className="fieldset border">
            <div>
              <label className="large">Invoice</label>
              <input name="concept" type="text" placeholder="Concept of invoice" />
            </div>
            <div>
              <label>Bitcoin Address<a class="right color-accent" href="/profile">or configure an XPUB</a></label>
              <input name="address" type="text" placeholder="Bitcoin Address" />
            </div>
          </div>

          <div className="fieldset border">
            <Recipient
              dataSource={dataSource.from}
              label="Bill from"
              onChange={(value) => onChange('from', value)}
            />
            <Recipient
              dataSource={dataSource.to}
              key="to"
              label="Bill to"
              onChange={(value) => onChange('to', value)}
            />
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
              { dataSource.items.map((product, index) => (
                <ProductItem
                  key={index.toString()}
                  dataSource={product}
                  onDelete
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
              <textarea name="terms" placeholder="Enter Terms & Conditions" />
            </div>
            <div />
          </div>

          <div className="fieldset">
            <div></div>
            <div>
              <div className="row">
                <label>Total</label>
                <strong>{price()}</strong>
              </div>
              <div className="row">
                <label>Total Bitcoin</label>
                <strong>{price()}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="options">
          <button>Send Invoice</button>
          <div className="row">
            <button className="outlined">Preview</button>
            <button className="outlined">Download</button>
          </div>
          <div className="column">
            <label>Currency</label>
            <select className="border">
              { CURRENCIES.map((item, index) => <option key={index.toString()}>{item}</option>)}
            </select>
          </div>
          <div className="column">
            <label>Date Format</label>
            <select className="border">
              { DATE_FORMATS.map((item, index) => <option key={index.toString()}>{item}</option>)}
            </select>
          </div>

          <div className="row">
            <input type="checkbox" />
            <label>Don't want BITCOIN</label>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<InvoiceDemo />, document.getElementById('demo'));
