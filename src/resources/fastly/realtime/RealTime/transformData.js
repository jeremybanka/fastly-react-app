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

import { utcSecond } from "d3-time";
import type { RealTimeDataType } from "..";

type DataPoint = {
  date: Date,
  [key: string]: number,
};

// return a Date object from a data point (timestamp is seconds)
const getDate = (d: RealTimeDataType): Date => new Date(d.recorded * 1000);

function transformData(dataset: RealTimeDataType[], metrics: string[]): DataPoint[] {

  const size = 120;

  const endDate = (dataset.length)
    ? getDate(dataset[dataset.length - 1])
    : Math.floor(Date.now() / 1000) * 1000;
  const startDate = new Date(endDate - size * 1000);

  const intervals = utcSecond.range(startDate, endDate);
  
  const range = dataset.slice(-1 * size);

  const transformed = intervals.map((interval) => {
    const datum = {
      date: interval,
    };

    range.forEach((d) => {
      // Is there a match for the timestamp in the timeseries data?
      const match = range.find((v) => getDate(v).valueOf() === interval.valueOf());
      // Create the datum point using matched data if present, otherwise empty
      metrics.forEach((m) => {
        datum[m] = match?.aggregated?.[m] || 0;
      })
    })

    return datum;
  });

  return transformed;
}

export default transformData;
