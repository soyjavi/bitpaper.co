import { ERROR } from '../common';
import MAP from '../../map.json';

export default (req, res, next) => {
  const url = req.originalUrl.split('/')[2].split('?')[0];
  const route = MAP[url];
  let error;

  if (!route) error = `Unknown route: ${url}`;
  else {
    const { required = [], optional = [], secure = false } = route;

    // 1. Test if has a valid session
    if (secure && !req.session) return ERROR.FORBIDDEN(res);

    // 2. Plain props
    const routeProps = required.concat(optional);
    const props = {};
    Object.keys(req.props).forEach((key) => {
      if (routeProps.includes(key)) props[key] = req.props[key];
    });

    // 3. Required parameters
    if (required.length > 0) {
      const propsKeys = Object.keys(props);
      const requiredParameters = required.filter((x) => !propsKeys.includes(x));

      if (requiredParameters.length > 0) error = `Required parameters: ${requiredParameters.join(', ')}`;
    }

    req.props = props;
  }

  if (error) return ERROR.MESSAGE(res, { message: error });

  return next();
};
