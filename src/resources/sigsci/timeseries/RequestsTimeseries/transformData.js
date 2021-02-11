// @flow

/*
  This takes sigsci timeseries endpoint data and transforms it into
  the shape required by the TimeseriesChart component:
  [
    {
      date: Thu Jan 07 2021 02:00:00 GMT-0800 (Pacific Standard Time)
      SQLI: 10,
      XSS: 5,
      CMDEXE: 20
    },
    {
      date: Thu Jan 07 2021 02:10:00 GMT-0800 (Pacific Standard Time)
      SQLI: 15,
      XSS: 10,
      CMDEXE: 25
    },
  ]
*/

import type { TimeseriesType } from "..";

type DataPoint = {
  date: Date,
  [key: string]: number,
};

function transformData(
  data: $PropertyType<TimeseriesType, "data">
): DataPoint[] {
  // construct dates for each point in series
  const dates = data[0].data.map(
    (count, i) => new Date(1000 * (data[0].from + i * data[0].inc))
  );

  // transform the data
  const seriesData = dates.map((date, idx) => {
    const item = { date };
    data.forEach((s) => {
      item[s.label] = s.data[idx];
    });
    return item;
  });

  return seriesData;
}

export default transformData;
