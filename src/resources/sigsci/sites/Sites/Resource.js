// @flow

import * as React from "react";
import { Resource } from "rsrc";
import { AuthMissing } from "../../../../components";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import Select from "./Select";

type Props = {
  children: (resource: Object) => React.Node,
};
function Sites(props: Props): React.Node {
  const [storedAuth] = useLocalStorage("sigsciAuth", {});
  const { accessToken, user } = storedAuth;

  // Do not try to request if we don't have credentials
  if (!accessToken || !user) return <AuthMissing />;

  const { children } = props;
  const corpName = "_";

  const url = `/api/v0/corps/${corpName}/sites`;

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

Sites.Select = Select;

export default Sites;
