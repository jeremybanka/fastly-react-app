// @flow

import * as React from "react";
import { MultiSelectInput } from ".";
import type { OptionType } from "./MultiSelectInput";

type Props = {
  value: string[],
  onChange: (options: OptionType[]) => void,
};

const options: OptionType[] = [
  {
    value: "resp_body_bytes",
    label: "resp_body_bytes",
    description: "Number of body bytes from origin.",
  },
  {
    value: "resp_header_bytes",
    label: "resp_header_bytes",
    description: "Number of header bytes from origin.",
  },
  {
    value: "responses",
    label: "responses",
    description: "Number of responses from origin.",
  },
  {
    value: "status_1xx",
    label: "status_1xx",
    description: "Number of 1xx \"Informational\" category status codes delivered from origin.",
  },
  {
    value: "status_200",
    label: "status_200",
    description: "Number of responses received with status code 200 (Success) from origin.",
  },
  {
    value: "status_204",
    label: "status_204",
    description: "Number of responses received with status code 204 (No Content) from origin.",
  },
  {
    value: "status_206",
    label: "status_206",
    description: "Number of responses received with status code 206 (Partial Content) from origin.",
  },
  {
    value: "status_2xx",
    label: "status_2xx",
    description: "Number of 2xx \"Success\" status codes delivered from origin.",
  },
  {
    value: "status_301",
    label: "status_301",
    description: "Number of responses received with status code 301 (Moved Permanently) from origin.",
  },
  {
    value: "status_302",
    label: "status_302",
    description: "Number of responses received with status code 302 (Found) from origin.",
  },
  {
    value: "status_304",
    label: "status_304",
    description: "Number of responses received with status code 304 (Not Modified) from origin.",
  },
  {
    value: "status_3xx",
    label: "status_3xx",
    description: "Number of 3xx \"Redirection\" codes delivered from origin.",
  },
  {
    value: "status_400",
    label: "status_400",
    description: "Number of responses received with status code 400 (Bad Request) from origin.",
  },
  {
    value: "status_401",
    label: "status_401",
    description: "Number of responses received with status code 401 (Unauthorized) from origin.",
  },
  {
    value: "status_403",
    label: "status_403",
    description: "Number of responses received with status code 403 (Forbidden) from origin.",
  },
  {
    value: "status_404",
    label: "status_404",
    description: "Number of responses received with status code 404 (Not Found) from origin.",
  },
  {
    value: "status_416",
    label: "status_416",
    description: "Number of responses received with status code 416 (Range Not Satisfiable) from origin.",
  },
  {
    value: "status_429",
    label: "status_429",
    description: "Number of responses received with status code 429 (Too Many Requests) from origin.",
  },
  {
    value: "status_4xx",
    label: "status_4xx",
    description: "Number of 4xx \"Client Error\" codes delivered from origin.",
  },
  {
    value: "status_500",
    label: "status_500",
    description: "Number of responses received with status code 500 (Internal Server Error) from origin.",
  },
  {
    value: "status_501",
    label: "status_501",
    description: "Number of responses received with status code 501 (Not Implemented) from origin.",
  },
  {
    value: "status_502",
    label: "status_502",
    description: "Number of responses received with status code 502 (Bad Gateway) from origin.",
  },
  {
    value: "status_503",
    label: "status_503",
    description: "Number of responses received with status code 503 (Service Unavailable) from origin.",
  },
  {
    value: "status_504",
    label: "status_504",
    description: "Number of responses received with status code 504 (Gateway Timeout) from origin.",
  },
  {
    value: "status_505",
    label: "status_505",
    description: "Number of responses received with status code 505 (HTTP Version Not Supported) from origin.",
  },
  {
    value: "status_5xx",
    label: "status_5xx",
    description: "Number of 5xx \"Server Error\" codes delivered from origin.",
  },
];

const OriginsMetricSelect = (props: Props): React.Node => {
  const { value, onChange } = props;

  return (
    <MultiSelectInput value={value} options={options} onChange={onChange} />
  );
};

export default OriginsMetricSelect;
