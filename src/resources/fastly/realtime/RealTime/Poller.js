// @flow

import * as React from "react";
import { RequestRejected } from "../../../../components";
import { Box } from "cosmo";
import type { RealTimeType } from "../"

const defaults = {
  dataset: [],
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
    }
  },
  children: (resource: Object) => React.Node,
};
const Poller = (props: Props): React.Node => {
  const { resource, children } = props;
  const { state } = resource;

  const [dataset, setDataset] = React.useState<{}[]>(defaults.dataset);
  const [lastResponseTimestamp, setLastResponseTimestamp] = React.useState<?number>(defaults.lastResponseTimestamp);

  const getLatest = async () => storeValues(await resource.actions.getLatest(lastResponseTimestamp));

  const storeValues = (response:RealTimeType, replace:boolean=false) => {
    setDataset(replace ? [...response.Data] : [...dataset,...response.Data]);
    setLastResponseTimestamp(response.Timestamp);
  }

  React.useEffect(() => {
    let pollTimer = setTimeout(() => getLatest(), 1000);
    return () => clearTimeout(pollTimer);
  });

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
