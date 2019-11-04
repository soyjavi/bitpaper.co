import { func, shape } from 'prop-types';
import React, { PureComponent } from 'react';

import { price } from '../../common';

class ProductItem extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(key, { target: { value } }) {
    // const { props: { dataSource, onChange } } = this;
    // onChange({ ...dataSource, [key]: value });
  }

  render() {
    const {
      onChange,
      props: { dataSource: { name, cost = 0, quantity = 0 } },
    } = this;

    return (
      <tr>
        <td>
          <input
            name="name"
            defaultValue={name}
            placeholder="Item Name"
            onChange={(event) => onChange('name', event)}
          />
        </td>
        <td className="right">
          <input
            type="number"
            name="cost"
            placeholder="Cost"
            onChange={(event) => onChange('cost', event)}
          />
        </td>
        <td className="right">
          <input
            type="number"
            name="quantity"
            placeholder="0"
            onChange={(event) => onChange('quantity', event)}
          />
        </td>
        <td className="right">{price(cost * quantity)}</td>
        <td className="row">
          <button className="secondary">Delete</button>
        </td>
      </tr>
    );
  }
}

ProductItem.propTypes = {
  dataSource: shape({}).isRequired,
  onChange: func.isRequired,
};

ProductItem.defaultProps = {

};

export default ProductItem;
