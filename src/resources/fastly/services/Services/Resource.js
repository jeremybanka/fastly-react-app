// @flow

import * as React from "react";
import { Resource } from "rsrc";
import { AuthMissing } from "../../../../components";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import Select from "./Select";

type Props = {
  children: (resource: Object) => React.Node,
};
function Services(props: Props): React.Node {
  const [storedAuth] = useLocalStorage("fastlyAuth", {});
  const { accessToken } = storedAuth;

  // Do not try to request if we don't have credentials
  if (!accessToken) return <AuthMissing />;

  const { children } = props;

  const url = `/service`;

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

Services.Select = Select;

export default Services;
