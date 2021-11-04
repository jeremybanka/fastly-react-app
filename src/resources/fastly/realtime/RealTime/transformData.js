// @flow

/*
  This takes fastly timeseries endpoint data and transforms it into
  the shape required by the TimeseriesChart component:
  [
    {
      date: Thu Jan 07 2021 02:00:00 GMT-0800 (Pacific Standard Time)
      requests: 10,
      hit: 5,
      miss: 20,
      ...
    },
    {
      date: Thu Jan 07 2021 02:10:00 GMT-0800 (Pacific Standard Time)
      requests: 15,
      hit: 10,
      miss: 25,
      ...
    },
    ...
  ]
*/

import type { RealTimeDataType } from "..";
import _ from 'lodash';

type DataPoint = {
  date: number,
  [key: string]: number,
};

function extractDatacenters(dataset: RealTimeDataType[]): string[] {
  return _.chain(dataset)
    .map((d:RealTimeDataType) => _.keys(d.datacenter))
    .flatten()
    .value();
};

const findTimeRange = (dataset: { recorded:number }[], limit:number, from:?number, until:?number):[number, number] => {
  let endTime = Math.floor(new Date() / 1000) * 1000;
  if (until) endTime = until;
  else if (dataset.length) endTime = _.last(dataset).recorded * 1000;
  let startTime = endTime - (limit * 1000);
  if (from) startTime = from;
  return [startTime, endTime];
};

function transformData(dataset: { recorded:number }[], limit, from:?number, until:?number, datacenter:?string): DataPoint[] {
  const [startTime, endTime] = findTimeRange(dataset, limit, from, until);
  return dataset
    .map((d) => _.assign({ date: new Date(d.recorded * 1000) }, d))
    .filter((d) => d.date >= startTime && d.date <= endTime)
    .map((d) => {
      const obj = (datacenter && datacenter.length)
        ? d.datacenter[datacenter] || {}
        : d.aggregated;
      const edgeRequests = (obj.hits || 0) + (obj.miss || 0);
      return _.assign({ 
        date: d.date,
        bandwidth: ((obj.body_size || 0) + (d.aggregated.header_size || 0)) * 8,
        hit_ratio: (obj.miss && edgeRequests) ? 1 - obj.miss / edgeRequests : 1,
      }, obj)
    })
}

export { extractDatacenters, transformData };
export default transformData;
