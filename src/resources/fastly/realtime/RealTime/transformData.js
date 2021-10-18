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

import type { RealTimeDataType } from "..";
import _ from 'lodash';

type DataPoint = {
  date: Date,
  [key: string]: number,
};

function transformData(dataset: RealTimeDataType[]): DataPoint[] {
  return dataset.map((d:RealTimeDataType) => {
    return _.assign({
      date: new Date(d.recorded * 1000),
    }, d.aggregated)
  });
}

export default transformData;
