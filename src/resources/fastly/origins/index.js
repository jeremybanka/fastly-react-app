// @flow

import Origins from "./Origins";

export { Origins };

export type OriginsType = {
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
