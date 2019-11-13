export default (value) => {
  const date = new Date(value);

  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
};
