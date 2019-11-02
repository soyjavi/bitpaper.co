const FORM_METHODS = ['POST', 'PUT'];

export default async ({
  headers = {}, method = 'GET', service, ...props
}) => (
  new Promise((resolve, reject) => {
    fetch(service, {
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...headers,
      },
      method,
      ...(FORM_METHODS.includes(method) ? { body: JSON.stringify(props) } : props),
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
