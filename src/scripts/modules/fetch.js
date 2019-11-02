const FORM_METHODS = ['POST', 'PUT'];
const HEADER_JSON = {
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};
const HEADER_FORM = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
};

const queryString = (props = {}) => (
  Object.keys(props)
    .filter((key) => props[key] !== undefined && props[key] !== '')
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(props[key])}`)
    .join('&') // eslint-disable-line
);

export default async ({
  headers = {}, method = 'GET', service, ...props
}) => (
  new Promise((resolve, reject) => {
    fetch(service, {
      headers: {
        ...(FORM_METHODS.includes(method) ? HEADER_FORM : HEADER_JSON),
        ...headers,
      },
      method,
      ...(FORM_METHODS.includes(method) ? { body: queryString(props) } : props),
      props,
    })
      .then(async (response) => {
        const json = await response.json();

        if (response.status >= 400) reject({ code: response.status, message: json.message }); // eslint-disable-line
        else resolve(json);
      }).catch(({ message = 'Something wrong happened. Try again.', response } = {}) => {
        reject({ // eslint-disable-line
          code: response ? response.status : 500,
          message,
        });
      });
  })
);
