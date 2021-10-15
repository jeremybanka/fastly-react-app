// @flow

import RealTime from "./RealTime";

export { RealTime };

type RealTimeDataType = {
  datacenter: Object,
  aggregated: Object,
  recorded: number, // timestamp in seconds
};

type RealTimeType = {
  Data: RealTimeDataType[],
  Timestamp: number,
  AggregateDelay: number,
};

export type { RealTimeType, RealTimeDataType }