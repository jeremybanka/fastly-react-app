// @flow

import * as React from "react";
import { RequestRejected } from "components";
import { Box } from "cosmo";
import type { RealTimeType } from "../"
import { transformData, extractDatacenters } from "./transformData";
import type { RealTimeDataType } from "..";
import _ from 'lodash';

type DataAction = {
  type: string,
  data?: ?RealTimeDataType[],
  timestamp?: ?number,
  from: ?number,
  until: ?number,
  datacenters?: string[],
  setDatacenters?: ?(string[]) => void,
  datacenter: ?string,
  limit: number
};

type DataState = {
  filteredData: { date:number }[],
  collectedData: { recorded:number }[],
  lastReceived: ?number,
  from: ?number,
  until: ?number,
}

const dataInitialState:DataState = {
  filteredData: [],
  collectedData: [],
  lastReceived: null,
  from: null,
  until: null,
}

const dataReducer = (state:DataState, action:DataAction) => {
  let tmp:DataState = { ...state };
  switch (action.type) {
    case "clear":
      action.setDatacenters?.([]);
      tmp.collectedData = [];
      tmp.lastReceived = null;
      tmp.filteredData = [];
      tmp.from = null;
      tmp.until = null;
      break;
    case "set":
      action.setDatacenters?.(_.uniq([...action.datacenters || [], ...extractDatacenters(action.data || [])]).sort());
      tmp.collectedData = (action.data) ? _.takeRight([...action.data], action.limit) : [];
      tmp.lastReceived = action.timestamp;
      tmp.filteredData = transformData(tmp.collectedData, action.limit, action.from, action.until, action.datacenter);
      break;
    case "append":
      action.setDatacenters?.(_.uniq([...action.datacenters || [], ...extractDatacenters(action.data || [])]).sort());
      tmp.collectedData = _.takeRight((action.data) ? [...state.collectedData,...action.data] : [...state.collectedData], action.limit);
      tmp.lastReceived = action.timestamp;
      tmp.filteredData = transformData(tmp.collectedData, action.limit, action.from, action.until, action.datacenter);
      break;
    case "filter":
      tmp.filteredData = transformData(state.collectedData, action.limit, action.from, action.until, action.datacenter);
      break;
    default:
      return tmp;
  }
  return tmp;
};

type Props = {
  params: {
    serviceId: string,
    datacenter: string,
    limit: number,
  },
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
      getHistory: (?number) => Promise<RealTimeType>,
    },
  },
  query?: {
    from?: number,
    until?: number,
  },
  onDatacentersUpdated?: (datacenters: string[]) => void,
  children: (resource: Object) => React.Node,
};
const Poller = (props: Props): React.Node => {
  const { params, resource, query, onDatacentersUpdated = (datacenters: string[]) => undefined, children } = props;
  const { datacenter, limit } = params;
  const { state } = resource;
  const { from, until } = query || { from: null, until: null };

  const [datacenters, setDatacenters] = React.useState([]);
  const [dataState, dataDispatch] = React.useReducer(dataReducer, dataInitialState);

  const getLatest = async () => {
    if (dataState.lastReceived) {
      const response = await resource.actions.getLatest(dataState.lastReceived);
      dataDispatch({ 
        type: "append",
        data: response.Data,
        timestamp: response.Timestamp,
        setDatacenters,
        datacenters,
        limit,
        from,
        until,
        datacenter,
      });
    }
  };

  React.useEffect(() => {
    let pollTimer = setTimeout(() => getLatest(), 1000);
    return () => clearTimeout(pollTimer);
  });

  React.useEffect(() => {
    dataDispatch({ 
      type: "filter", 
      limit,
      from,
      until,
      datacenter,
    })
    return () => dataDispatch({ 
      type: "clear",
      limit,
      from,
      until,
      datacenter
    }) 
  }, [limit, from, until, datacenter]);

  React.useEffect(() => {
    onDatacentersUpdated?.(datacenters)
    return () => {}
  }, [datacenters, onDatacentersUpdated]);

  if (state.rejected) return <RequestRejected reason={state.reason.message} />;

  if (!state.fulfilled) return <Box backgroundColor="grays.1">Awaiting Data...</Box>;

  const { value } = state;
  if (value.Timestamp && !dataState.lastReceived) {
    dataDispatch({ 
      type: "set", 
      data: value.Data,
      timestamp: value.Timestamp,
      setDatacenters,
      datacenters,
      limit,
      from,
      until,
      datacenter,
    });
  }

  if (!dataState.filteredData.length) return (
    <div>No results loaded for current selections.</div>
  )
  
  return (
    <>
      {typeof children === "function"
        ? children({ 
            dataset: dataState.filteredData || dataState.collectedData, 
            lastResponseTimestamp: dataState.lastReceived 
          })
        : children}
    </>
  );
};

export default Poller;
