// @flow

import * as React from "react";
import { stringify } from "query-string";
import { Resource } from "rsrc";
import { AuthMissing } from "components";
import useLocalStorage from "hooks/useLocalStorage";
import Chart from "./Chart";
import Poller from "./Poller";
import config from "config"

type Props = {
  params: {
    serviceId: string,
    limit: number,
  },
  query?: {
    kind?: string,
  },
  children: (resource: Object) => React.Node,
};
function RealTime(props: Props): React.Node {
  const [storedAuth] = useLocalStorage("fastlyAuth", {});
  const { accessToken } = storedAuth;

  // Do not try to request if we don't have credentials
  if (!accessToken) return <AuthMissing />;

  const { params, query, children } = props;
  const { serviceId, limit } = params;
  const qs = (query?.kind)
    ? `?${stringify({ kind: query.kind })}`
    : '';

  const options = {
    headers: {
      "Content-Type": "application/json",
      "Fastly-Key": accessToken
    },
  };
  const host = (config.whistler && config.whistler.origin) || ''
  const url = `${host}/v1/channel/${serviceId}/ts/h/limit/${limit}${qs}`

  const getLatest = (ts) => ({
    url: `${host}/v1/channel/${serviceId}/ts/${ts}?${qs}`,
    options: {
      ...options,
      method: "GET",
    },
  });

  const getHistory = (ts) => ({
    url: url,
    options: {
      ...options,
      method: "GET",
    },
  });

  return (
    <Resource url={url} options={options} actions={{getLatest, getHistory}}>
      {children}
    </Resource>
  );
}

RealTime.Chart = Chart;
RealTime.Poller = Poller;

export default RealTime;
