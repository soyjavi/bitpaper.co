import { ERROR } from '../common';
import MAP from '../../map.json';

export default (req, res, next) => {
  const url = req.originalUrl.split('/')[2].split('?')[0];
  const route = MAP[url];

  if (!route) return ERROR.MESSAGE(res, { message: `Unknown route: ${url}` });
  const { required = [], optional = [], secure = false } = route;

  // 1. Test if has a valid session
  if (secure && !req.session) return ERROR.FORBIDDEN(res);

  // 2. Plain props
  const routeProps = required.concat(optional);
  const props = { domain: req.props.domain };
  Object.keys(req.props).forEach((key) => {
    if (routeProps.includes(key)) props[key] = req.props[key];
  });


  // 3. Required parameters
  if (required.length > 0) {
    const requiredParameters = required.filter((x) => !Object.keys(props).includes(x));

    if (requiredParameters.length > 0) {
      return ERROR.MESSAGE(res, { message: `Required parameters: ${requiredParameters.join(', ')}` });
    }
  }

  req.props = props;

  return next();
};
