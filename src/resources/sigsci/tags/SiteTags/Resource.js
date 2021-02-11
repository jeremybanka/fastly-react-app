// @flow

import * as React from "react";
import { stringify } from "query-string";
import { Resource } from "rsrc";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import Label from "./Label";
import Select from "./Select";
import { AuthMissing } from "../../../../components";

type Props = {
  params: {
    siteName: string,
  },
  query: Object,
  children: (resource: Object) => React.Node,
};
function SiteTags(props: Props): React.Node {
  const [storedAuth] = useLocalStorage("sigsciAuth", {});
  const { accessToken, user } = storedAuth;

  // Do not try to request if we don't have credentials
  if (!accessToken || !user) return <AuthMissing />;

  const { params, query, children } = props;
  const { siteName } = params;
  const qs = stringify({
    namespace: "all",
    ...query,
  });

  const url = `/api/v0/corps/_/sites/${siteName}/tags?${qs}`;

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

SiteTags.Label = Label;
SiteTags.Select = Select;

export default SiteTags;
