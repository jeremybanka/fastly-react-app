// @flow

import * as React from "react";
import { RequestRejected } from "../../../../components";
import { Box } from "cosmo";
import type { RealTimeType } from "../"
import transformData from "./transformData";
import _ from 'lodash';

const defaults = {
  dataset: [],
  collectedData: [],
  lastResponseTimestamp: null,
  doPolling: true
}

type Props = {
  resource: {
    state: {
      rejected?: boolean,
      fulfilled?: boolean,
      reason: {
        message: string,
      },
      value: RealTimeType,
    },
    actions: {
      getLatest: (?number) => Promise<RealTimeType>,
    },
  },
  query?: {
    from?: number,
    until?: number,
  },
  children: (resource: Object) => React.Node,
};
const Poller = (props: Props): React.Node => {
  const { resource, query, children } = props;
  const { state } = resource;
  const { from, until } = query || { from: null, until: null };

  const [dataset, setDataset] = React.useState<{date:number}[]>(defaults.dataset);
  const [collectedData, setCollectedData] = React.useState<{date:number}[]>(defaults.collectedData);
  const [lastResponseTimestamp, setLastResponseTimestamp] = React.useState<?number>(defaults.lastResponseTimestamp);

  const getLatest = async () => storeValues(await resource.actions.getLatest(lastResponseTimestamp));

  const filterData = (data:{date:number}[], from:?number=null, until:?number=null):{date:number}[] => { 
    const endTime = until || _.last(data)?.date || Math.floor(new Date() / 1000) * 1000;
    const startTime = from || _.first(data)?.date || endTime - (1000 * 120);
    return data.filter((item:{date:number}) => (item.date >= startTime && item.date <= endTime));
  }

  const storeValues = (response:RealTimeType, replace:boolean=false) => {
    const transformedData = transformData(response.Data);
    const combinedData = replace ? [...transformedData] : [...collectedData,...transformedData]
    setCollectedData(_.takeRight(combinedData, 120));
    if (!from || !dataset.length) setDataset(filterData(collectedData, from, until));
    setLastResponseTimestamp(response.Timestamp);
  }

  React.useEffect(() => {
    let pollTimer = setTimeout(() => getLatest(), 1000);
    return () => clearTimeout(pollTimer);
  });

  React.useEffect(() => {
    setDataset(filterData(collectedData, from, until));
  }, [from, until]);

  if (state.rejected) return <RequestRejected reason={state.reason.message} />;

  if (!state.fulfilled) return <Box backgroundColor="grays.1">Awaiting Data...</Box>;

  const { value } = state;
  if (value.Data && value.Timestamp && !dataset.length) storeValues(value);
  
  return (
    <>
      {typeof children === "function"
        ? children({ dataset, lastResponseTimestamp })
        : children}
    </>
  );
};

export default Poller;
