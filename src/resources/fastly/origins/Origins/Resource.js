// @flow

import * as React from "react";
import { stringify } from "query-string";
import { Resource } from "rsrc";
import { AuthMissing } from "../../../../components";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import Chart from "./Chart";
import getIncrement from "./getIncrement";

type Props = {
  params: {
    serviceId: string,
  },
  query: {
    start: string,
    end: string,
    region: string,
    sum_by: string,
  },
  children: (resource: Object) => React.Node,
};
function Origins(props: Props): React.Node {
  const [storedAuth] = useLocalStorage("fastlyAuth", {});
  const { accessToken } = storedAuth;

  // Do not try to request if we don't have credentials
  if (!accessToken) return <AuthMissing />;

  const { params, query, children } = props;
  const { serviceId } = params;
  const { start, end, region, metrics } = query;

  const downsample = getIncrement(
    Number(Number(start) * 1000),
    Number(end ? Number(end) * 1000 : Date.now())
  );
  const qs = stringify({ sum_by: 'host', metric: metrics.join(','), start, end, downsample, region });

  const url = `/metrics/origins/services/${serviceId}?${qs}`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      "Fastly-key": accessToken,
    },
  };

  return (
    <Resource url={url} options={options}>
      {children}
    </Resource>
  );
}

Origins.Chart = Chart;

export default Origins;
