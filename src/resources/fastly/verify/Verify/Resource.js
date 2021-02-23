// @flow

import * as React from "react";
import { stringify } from "query-string";
import { Resource } from "rsrc";
import { AuthMissing } from "../../../../components";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import ServiceSelect from "./ServiceSelect";

type Props = {
  children: (resource: Object) => React.Node,
  query: any,
};

function Verify(props: Props): React.Node {
  const [storedAuth] = useLocalStorage("fastlyAuth", {});
  const { accessToken } = storedAuth;

  // Do not try to request if we don't have credentials
  if (!accessToken) return <AuthMissing />;

  const { children, query } = props;
  const qs = stringify(query);

  const url = `/verify?${qs}`;

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

Verify.ServiceSelect = ServiceSelect;

export default Verify;
