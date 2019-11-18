import { bool, func, shape } from 'prop-types';
import React, { PureComponent } from 'react';

import { formatPrice } from '../../common';
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
      props: {
        currency, dataSource: { name, price = 0, quantity = 0 }, onRemove, required,
      },
    } = this;

    return (
      <tr>
        <td>
          <Input
            value={name}
            name="name"
            onChange={onChange}
            placeholder="Item Name"
            required={required}
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
        <td className="right price">{formatPrice(price * quantity, currency)}</td>
        <td className="row">
          <button type="button" className="secondary" onClick={onRemove}>Delete</button>
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
  required: bool,
};

Item.defaultProps = {
  required: false,
};

export default Item;
