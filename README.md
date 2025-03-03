# Bypassing CSP Restrictions for Blob URL Downloads in Firefox

## Problem
When using the CSP directive `frame-src self;`, Firefox does not allow blob URLs to be used for file downloads via an anchor element. The Firefox browser interprets the specification in such a way that the blob URL is considered as the src URL of the iframe, and the CSP policies from the iframe's parent are applied. In this case, the download does not start and is logged with the following console error:

```
Content-Security-Policy: The page’s settings blocked the loading of a resource (frame-src) at blob:http://localhost:3333/d53cfb1b-6959-423d-898a-e010551b3b17 because it violates the following directive: “default-src 'self'”
```

See also:
- [Bugzilla: CSP header blocks file download in iframe for Firefox only](https://bugzilla.mozilla.org/show_bug.cgi?id=1365502)
- [Github: CSP frame-src blocked on Firefox for blob on Embedded app](https://github.com/Shopify/shopify-app-bridge/issues/11)
- [Github: Re-introduce frame-src blob: CSP directive to re-allow downloading Blobs via the Task Pane](https://github.com/OfficeDev/office-js/issues/1511)

[Mozilla comments on this as follows](https://bugzilla.mozilla.org/show_bug.cgi?id=1365502#c5):

> As far as we're concerned our behavior is correct: when you click the link you are navigating the frame to the data urls (we block it before the download is triggered). If users were allowed to navigate a frame to random sites then what is the value of frame-src? [...]

## Solution

### Idea
[In a GitHub comment, it says](https://github.com/Shopify/shopify-app-bridge/issues/11#issuecomment-710605337):

> [...] Apparently creating another iframe inside your app’s iframe can get around CSP? I haven't tested this, and it seems counter to the purpose of CSP, but it might work. [...]

Therefore, it should be possible for the parent to intercept the click on the anchor element, prevent the default behavior, and instead create a sub-iframe containing such an anchor element. The click would then be triggered on this sub-iframe.

### Implementation

[`./public/index.html`](./public/index.html) and [`./public/app.js`](./public/app.js) represents the parent client. [`./public/iframe.html`](./public/iframe.html) represents the client that is loaded inside the iframe.

The CSP directives are only set in [`./public/index.html`](./public/index.html) (parent) via a meta element. The workaround works in such a way that only the parent client needs to be modified, while the client embedded in the iframe remains unchanged.

```
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:">
```

### Demo

https://arberosmani.github.io/workaround-csp-frame-src-blocked-on-firefox/

### Start the Demo Locally

You can start any web server to serve the `./public` directory. If you have the PHP Cli installed, you can do it like this:

```bash
$ cd public
$ php -S 0.0.0.0:3000
```

Alternatively, you can start the included web server. The prerequisite is that you have NodeJS installed locally.

```bash
$ npm i
$ node app.js
```
