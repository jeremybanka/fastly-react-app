// @flow

/*
  This takes fastly timeseries endpoint data and transforms it into
  the shape required by the TimeseriesChart component:
  [
    {
      date: Thu Jan 07 2021 02:00:00 GMT-0800 (Pacific Standard Time)
      requests: 10,
      hit: 5,
      miss: 20
    },
    {
      date: Thu Jan 07 2021 02:10:00 GMT-0800 (Pacific Standard Time)
      requests: 15,
      hit: 10,
      miss: 25
    },
  ]
*/

import { utcDay, utcHour, utcMinute } from "d3-time";
import getIncrement from "./getIncrement";
import type { StatsType } from "..";

type DataPoint = {
  date: Date,
  [key: string]: number,
};

// return a Date object from a data point (start_time is seconds)
const getDate = (d: Object): Date => new Date(d.start_time * 1000);

// The replace() below fixes the timestamp for safari as it cannot parse the
// format provided by the fastly api, "2021-01-20 00:50:00 UTC"
const formatTimestamp = (t: string): string => t.replace(/-/g, "/");

function transformData(value: StatsType, metrics: string[]): DataPoint[] {
  const { data, meta } = value;
  const { from, to } = meta;
  const fromDate = new Date(formatTimestamp(from));
  const toDate = new Date(formatTimestamp(to));
  const increment = getIncrement(fromDate.getTime(), toDate.getTime());

  // Get a range of intervals from start to end date
  let timePeriod = utcMinute;
  if (increment === "hour") timePeriod = utcHour;
  if (increment === "day") timePeriod = utcDay;
  // Offset by 1 since range defaults to exclude the last interval
  const intervals = timePeriod.range(fromDate, timePeriod.offset(toDate, 1));

  const transformed = intervals.map((interval) => {
    // Is there a match for the timestamp in the timeseries data?
    const match = data.find((d) => getDate(d).valueOf() === interval.valueOf());
    // Create the datum point using matched data if present, otherwise empty
    const datum = {
      date: match ? getDate(match) : interval,
    };
    metrics.forEach((m) => {
      datum[m] = match && match[m] ? match[m] : 0;
    });
    return datum;
  });

  return transformed;
}

export default transformData;
