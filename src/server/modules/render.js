import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import PKG from '../../../package.json';
import cache from './cache';

dotenv.config();
const {
  COPYRIGHT, DOMAIN, TITLE, DESCRIPTION, FAVICON, ICON, IMAGE,
} = process.env;

const folder = path.resolve('.', 'src/views');
const bindingProp = new RegExp(/{{.*}}/, 'g');
const bindingObj = /{{(.*?)\.(.*?)}}/;

export default (filename = 'index', values = {}, forceCache = true) => {
  const cacheKey = `view:${filename}`;
  let view = forceCache ? cache.get(cacheKey) : undefined;

  if (!view) {
    if (!fs.existsSync(`${folder}/${filename}.html`)) throw new Error(`${filename} could not read correctly.`);
    view = fs.readFileSync(`${folder}/${filename}.html`, 'utf8');
    cache.set(cacheKey, view);
  }

  const {
    title,
    description = DESCRIPTION,
    image,
    url,
    scripts = [],
  } = values;

  const dataSource = {
    COPYRIGHT,
    DOMAIN,
    FAVICON: `${DOMAIN}${FAVICON}`,
    ICON: `${DOMAIN}${ICON}`,
    VERSION: PKG.version,

    ...values,
    scripts: scripts.map((script) => (
      `<script src="/scripts/${script}.js" defer></script>`
    )),
    title: title || TITLE,
    description,
    image: image || `${DOMAIN}${IMAGE}`,
    url: url ? `${DOMAIN}${url}` : DOMAIN,
  };

  Object.keys(dataSource).forEach((key) => {
    view = view.replace(new RegExp(`{{${key}}}`, 'g'), dataSource[key]);
  });

  let match = view.match(bindingObj);
  while (match !== null) {
    const [binding, base, prop] = match;

    view = view.replace(
      new RegExp(binding, 'g'),
      dataSource[base] && dataSource[base][prop] ? dataSource[base][prop] : '',
    );

    match = view.match(bindingObj);
  }

  view = view.replace(bindingProp, '');

  return view;
};
