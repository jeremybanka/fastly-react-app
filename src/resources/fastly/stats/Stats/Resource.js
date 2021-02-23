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
    from: string,
    to: string,
    region: string,
  },
  children: (resource: Object) => React.Node,
};
function Stats(props: Props): React.Node {
  const [storedAuth] = useLocalStorage("fastlyAuth", {});
  const { accessToken } = storedAuth;

  // Do not try to request if we don't have credentials
  if (!accessToken) return <AuthMissing />;

  const { params, query, children } = props;
  const { serviceId } = params;
  const { from, to, region } = query;
  const by = getIncrement(
    Number(Number(from) * 1000),
    Number(to ? Number(to) * 1000 : Date.now())
  );
  const qs = stringify({ from, to, by, region });

  const url = `/stats/service/${serviceId}?${qs}`;

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

Stats.Chart = Chart;

export default Stats;
