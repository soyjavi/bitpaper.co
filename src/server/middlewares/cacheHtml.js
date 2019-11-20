import { cache } from '../modules';

export default ({ originalUrl }, res, next) => {
  const cached = cache.get(originalUrl);

  if (cached) res.send(cached);
  else next();
};
