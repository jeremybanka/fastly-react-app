# observe-edge-ui

Observe@Edge Stats UI

> **INTERNAL USE ONLY**. This is a demo proof-of-concept and not ready for production.

## Overview

This is a demo site that uses live data from Fastly and Signal Sciences APIs to demonstrate the [signalsciences/rvis](https://github.com/signalsciences/rvis) charting library.

## Getting started

Run `yarn` from root to install project dependencies.

## Dev workflow

Run `yarn start` to run a development webserver.

The devserver will by default open a browser and use port `3000`. To specify different behavior, add a `.env` file to root:

```
BROWSER=none
PORT=3001
```

## Production build

To generate a production build of the demo site, run `yarn build` from root.

## Serving production build

To serve the production build, run `yarn serve`.

## Notes

In order to mitigate CORS, a small nodejs server is used to proxy requests to API endpoints.

## Metadata

- Team: Data Engineering + UI, UX Engineering
- Slack: #stats-chart-poc
- Engineer: Ben Pinkerton
- Engineer: Ali Torbati
- Engineer: John Donahue
- Engineer: Colton McCurdy
- Engineer: Herman Schaaf
- Engineer: Shawn Smith
- SRE: TODO
- Reference: TODO
- Runbook: TODO
- Shiply: https://shiply.fastly.com/fastly/observe-edge-ui
- PagerDuty: TODO
- JIRA: https://jira.corp.fastly.com/projects/DATAENG
- Jenkins: https://ci.secretcdn.net/job/team-data/job/observe-edge-ui/
