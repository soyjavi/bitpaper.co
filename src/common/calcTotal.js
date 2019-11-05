export default (items = []) => {
  const { total } = items
    .reduce((a, { quantity = 0, price = 0 }) => ({ total: (a.total) + (quantity * price) }), { total: 0 });

  return total;
};
