import { func, shape } from 'prop-types';
import React, { PureComponent } from 'react';

import { priceFormat } from '../../common';
import Input from './Input';

class Item extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(key, value) {
    const { props: { dataSource, onChange } } = this;
    onChange({ ...dataSource, [key]: value });
  }

  render() {
    const {
      onChange,
      props: { currency, dataSource: { name, price = 0, quantity = 0 }, onRemove },
    } = this;

    return (
      <tr>
        <td>
          <Input
            value={name}
            name="name"
            onChange={onChange}
            placeholder="Item Name"
          />
        </td>
        <td className="right">
          <Input
            value={price}
            name="price"
            onChange={onChange}
            placeholder="Cost"
            type="number"
          />
        </td>
        <td className="right">
          <Input
            value={quantity}
            name="quantity"
            onChange={onChange}
            placeholder="0"
            type="number"
          />
        </td>
        <td className="right price">{priceFormat(price * quantity, currency)}</td>
        <td className="row">
          <button className="secondary" onClick={onRemove}>Delete</button>
        </td>
      </tr>
    );
  }
}

Item.propTypes = {
  currency: shape({}).isRequired,
  dataSource: shape({}).isRequired,
  onChange: func.isRequired,
  onRemove: func.isRequired,
};

Item.defaultProps = {};

export default Item;
