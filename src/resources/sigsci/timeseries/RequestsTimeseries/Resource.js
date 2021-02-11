// @flow

import * as React from "react";
import { stringify } from "query-string";
import { Resource } from "rsrc";
import { AuthMissing } from "../../../../components";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import Chart from "./Chart";

type Props = {
  params: {
    siteName: string,
  },
  query: {
    from: string,
    until: string,
    tag: string[],
  },
  children: (resource: Object) => React.Node,
};
function RequestsTimeseries(props: Props): React.Node {
  const [storedAuth] = useLocalStorage("sigsciAuth", {});
  const { accessToken, user } = storedAuth;

  // Do not try to request if we don't have credentials
  if (!accessToken || !user) return <AuthMissing />;

  const { params, query, children } = props;
  const { siteName } = params;
  const qs = stringify(query);

  const url = `/api/v0/corps/_/sites/${siteName}/timeseries/requests?${qs}`;

  const options = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "x-api-user": user,
      "x-api-token": accessToken,
    },
  };

  return (
    <Resource url={url} options={options}>
      {children}
    </Resource>
  );
}

RequestsTimeseries.Chart = Chart;

export default RequestsTimeseries;
