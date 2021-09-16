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
import type { OriginsType } from "..";

type DataPoint = {
  date: Date,
  [key: string]: number,
};

// return a Date object from a data point (timestamp is seconds)
const getDate = (d: Object): Date => new Date(d.timestamp * 1000);

// The replace() below fixes the timestamp for safari as it cannot parse the
// format provided by the fastly api, "2021-01-20 00:50:00 UTC"
const formatTimestamp = (t: string): string => t.replace(/-/g, "/");

function transformData(value: OriginsType, metrics: string[]): DataPoint[] {
  const { data, meta } = value;
  const { start, end } = meta;
  const startDate = new Date(start);
  const endDate = new Date(end);

  const increment = getIncrement(startDate.getTime(), endDate.getTime());

  // Get a range of intervals from start to end date
  let timePeriod = utcMinute;
  if (increment === "hour") timePeriod = utcHour;
  if (increment === "day") timePeriod = utcDay;
  const intervals = timePeriod.range(startDate, endDate);

  const transformed = intervals.map((interval) => {
    const datum = {
      date: interval,
    };

    data.forEach((d) => {
      // Is there a match for the timestamp in the timeseries data?
      const match = d.values.find((v) => getDate(v).valueOf() === interval.valueOf());
      // Create the datum point using matched data if present, otherwise empty

      let key = d.dimensions.host;
      metrics.forEach((m) => {
        datum[key] = match && match[m] ? match[m] : 0;
      })
    })

    return datum;
  });

  return transformed;
}

export default transformData;
