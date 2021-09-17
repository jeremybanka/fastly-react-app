// @flow

import Domains from "./Domains";

export { Domains };

export type DomainsType = {
  data: {
    start_time: number, // timestamp in seconds
    [key: string]: number | string,
  }[],
  meta: {
    downsample: string,
    start: string,
    end: string,
  },
  status: string,
};
