# rvis

<!-- [![ci][ci-badge]][ci]
[![version][version-badge]][npm]
[![license][license-badge]](LICENSE.md)
[![gzip size][gzip-badge]][gzip] -->

[ci-badge]: https://github.com/signalsciences/rvis/workflows/CI/badge.svg
[ci]: https://github.com/signalsciences/rvis/actions
[version-badge]: https://badgen.net/npm/v/rvis
[npm]: https://npmjs.com/package/rvis
[gzip-badge]: http://badgen.net/bundlephobia/minzip/rvis
[gzip]: https://bundlephobia.com/result?p=rvis
[license-badge]: https://badgen.net/badge/license/MIT/blue

A collection of chart components built on [airbnb/visx](https://airbnb.io/visx/bars).

## Overview & Required Steps

This repo contains 2 projects:

- the `rvis` package (`/src`)
- a demo site that utilizes the `rvis` package (`/website`)

The `rvis` package is a work in progress and has not been published anywhere.

**As a result, it is required that you take the following steps to link it to the website project as if it were a published package.**

1. Install library deps - from root `yarn install`
1. Link the package for local dev - from root `yarn link`
1. Link the local lib copy in website - from `/website` run `yarn link rvis`
1. Install website deps - from `/website` run `yarn install`

---

## Temp Dev Workflow

Once everything is installed and connected you can fire up the dev env:

1. Start the lib dev server - from the root run `yarn dev`
1. In a separate tab, start the CRA server - from `/website` run `yarn start`

> It is expected that the final `rvis` package will be available as a standard dependency, avoiding the need for these steps.

---

## Temp Production Build Workflow

`cd ./website && yarn build && yarn serve` will build a production version of the demo site into the `/website/build` directory and serve it on port 5000.

Though the demo site is static, a server is required to proxy the API requests it makes in order to mitigate CORS restrictions.

> It is expected that the final demo site would not have the requirement of a server and could be served as a static asset.

---

NOTE: What follows is a stub of what the _final_ README.md might look like for the `rvis` package.

## Getting Started

```
yarn add rvis
```

## Usage

```jsx
import React from "react";
import { TimeSeriesChart, TimeSeriesLegend } from "rvis";
import data from "./data.js";

const App = (props) => {
  return (
    <>
      <TimeSeriesChart data={data} />
      <TimeSeriesLegend data={data} />
    </>
  );
};
```

TODO: Add prop definitions

### Related

- [@visx](https://github.com/airbnb/visx)
