# bitpaper.co
[![Build Status](http://img.shields.io/travis/soyjavi/bitpaper.co/master.svg?style=flat-square)](https://travis-ci.org/soyjavi/bitpaper.co)
[![dependencies Status](https://david-dm.org/soyjavi/bitpaper.co/status.svg?style=flat-square)](https://david-dm.org/soyjavi/bitpaper.co)
[![devDependencies Status](https://david-dm.org/soyjavi/bitpaper.co/dev-status.svg?style=flat-square)](https://david-dm.org/soyjavi/bitpaper.co?type=dev)
[![License](https://img.shields.io/github/license/soyjavi/bitpaper.co?style=flat-square)](https://spdx.org/licenses/AGPL-3.0-or-later)


> Invoicer using Bitcoin Native Segwit addresses

## endpoints

### [POST] /signup

### [POST] /login

### [GET] /search

### [GET] /profile

### [PUT] /profile

### [POST] /invoice

### [GET] /invoice/:id

### [GET] /invoice/:id/tx

### [PUT] /invoice/:id

### [DELETE] /invoice/:id


## .env file
here is an example:

```
#PRODUCTION=true
CACHE=900
PORT=8080

#SITE
COPYRIGHT=©2019 Soshilabs, Ltd.
DOMAIN=http://localhost:8080
TITLE=bitpaper
DESCRIPTION=Invoicing Software for Small Business.
ICON=/static/icon.png
IMAGE=/static/banner.jpg
EMAIL=sample@email.com

#EMAIL
EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_HOST=
EMAIL_PORT=
```
