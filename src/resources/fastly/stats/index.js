// @flow

import Stats from "./Stats";

export { Stats };

export type StatsType = {
  data: {
    start_time: number, // timestamp in seconds
    [key: string]: number | string,
  }[],
  meta: {
    by: string,
    from: string,
    region: string,
    to: string,
  },
  msg: string,
  status: string,
};
