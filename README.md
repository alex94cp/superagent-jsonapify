# superagent-jsonapify

[![NPM](https://nodei.co/npm/superagent-jsonapify.png?downloads=true)](https://nodei.co/npm/superagent-jsonapify/)

[![Dependencies](https://david-dm.org/alex94puchades/superagent-jsonapify.svg)](https://david-dm.org/alex94puchades/superagent-jsonapify)

A lightweight json-api client addon for superagent. If you don't know about [jsonapify](https://www.npmjs.com/package/jsonapify) or the [JSON-API format](http://jsonapi.org/format/), you should have a look.

## Usage

ES2015 style

```javascript
import superagent from 'superagent';
import superagentJsonapify from 'superagent-jsonapify';

superagentJsonapify(superagent);

const request = superagent.get('/api/videos?include=comments')
  .then(function(response) {
    const body = response.body;
    const video = body.data[0];
    const comments = video.comments;
  });
```
