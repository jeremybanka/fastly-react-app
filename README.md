# observe-edge-ui

Observe@Edge Stats UI

> **INTERNAL USE ONLY**. This is a demo proof-of-concept and not ready for production.

## Overview

This is a demo site that uses live data from Fastly and Signal Sciences APIs to demonstrate
the [signalsciences/rvis](https://github.com/signalsciences/rvis) charting library.

## Getting started

Run `yarn` from root to install project dependencies.

## Dev workflow

Run `yarn start` to run a development webserver.

The devserver will by default open a browser and use port `3000`. To specify different behavior, add a `.env` file to
root:

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

## Deployment

This project is deployed to Kubernetes using the Elevation platform. The Helm chart is defined
under [charts/observe-edge-ui](charts/observe-edge-ui).

### Deploying to the Dev Cluster

Deployments to the dev Kubernetes cluster can be done locally using `kubectl`. To set this up, follow the steps
under [Onboarding Process](https://docs.elevation.secretcdn.net/onboarding/kubernetes/). You will also need to
be [connected to the VPN](https://docs.elevation.secretcdn.net/onboarding/vpn/).

Once logged in with `oulogin`, you are now ready to deploy. Within the [charts](charts) directory, run:

```shell
helm -n data-engineering upgrade -f observe-edge-ui/values.yaml -i observe-edge-ui observe-edge-ui
```

If successful, the changes should be viewable
at [https://observe-edge-ui.int.usc1.dev.k8s.secretcdn.net/](https://observe-edge-ui.int.usc1.dev.k8s.secretcdn.net/).
Again, `.int.` indicates that this is an internal endpoint, and you need to be connected to the VPN to view it.

You may then use `kubectl` to further inspect the deployment. Here are some useful commands:

#### List Deployments

```shell
kubectl -n data-engineering describe deployments
```

#### List Pods

```shell
kubectl -n data-engineering get pods
```

#### List Ingresses

```shell
kubectl -n data-engineering get ing
```

### Deploying to the Staging Cluster

After your changes to the code are reviewed and merged to the `main` branch, a pull request will automatically be raised
to [elevation-data](https://github.com/fastly/elevation-data). Merge this to bump the image version and deploy to
staging.

Staging deploys are available
under [observe-edge-ui.stg.k8s.secretcdn.net](https://observe-edge-ui.stg.k8s.secretcdn.net/).

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
