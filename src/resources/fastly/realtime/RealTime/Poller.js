// @flow

import * as React from "react";
import { RequestRejected } from "../../../../components";
import { Box } from "cosmo";
import type { RealTimeType } from "../"
import transformData from "./transformData";
import _ from 'lodash';

const dataInitialState = {
  filteredData: [],
  collectedData: [],
  lastReceived: null,
  from: null,
  until: null,
}

const dataReducer = (state, action) => {
  let tmp = { ...state };
  switch (action.type) {
    case "set":
      tmp.collectedData = _.takeRight([...transformData(action.data)], 120);
      tmp.lastReceived = action.timestamp;
      tmp.filteredData = (action.from && action.until) 
        ? tmp.collectedData.filter((item) => (item.date >= action.from && item.date <= action.until))
        : null;
      break;
    case "append":
      tmp.collectedData = _.takeRight([...state.collectedData,...transformData(action.data)], 120);
      tmp.lastReceived = action.timestamp;
      break;
    case "filter":
      tmp.filteredData = (action.from && action.until) 
        ? tmp.collectedData.filter((item) => (item.date >= action.from && item.date <= action.until))
        : null;
      break;
    default:
      return tmp;
  }
  return tmp;
};

type Props = {
  params: {
    serviceId: string,
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
  children: (resource: Object) => React.Node,
};
const Poller = (props: Props): React.Node => {
  const { params, resource, query, children } = props;
  const { serviceId } = params;
  const { state } = resource;
  const { from, until } = query || { from: null, until: null };

  const [dataState, dataDispatch] = React.useReducer(dataReducer, dataInitialState);

  const getLatest = async () => {
    if (dataState.lastReceived) {
      const response = await resource.actions.getLatest(dataState.lastReceived);
      dataDispatch({ 
        type: "append", 
        data: response.Data,
        timestamp: response.Timestamp,
      });
    }
  };

  React.useEffect(() => {
    let pollTimer = setTimeout(() => getLatest(), 1000);
    return () => clearTimeout(pollTimer);
  });

  React.useEffect(() => {
    dataDispatch({ type: "filter", from: from, until: until })
  }, [from, until]);

  if (state.rejected) return <RequestRejected reason={state.reason.message} />;

  if (!state.fulfilled) return <Box backgroundColor="grays.1">Awaiting Data...</Box>;

  const { value } = state;
  if (value.Timestamp && !dataState.lastReceived) {
    dataDispatch({ 
      type: "set", 
      data: value.Data,
      timestamp: value.Timestamp,
      from: from,
      until: until,
    });
  }

  if (!dataState.filteredData && !dataState.collectedData.length) {
    return <div>No data for Service ID: '{serviceId}' selected range.</div>
  }

  
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
