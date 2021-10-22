// @flow

import * as React from "react";
import { 
  useHistory, 
  useLocation, 
  useRouteMatch, 
  useParams, 
  generatePath, 
  Redirect,
} from "react-router-dom";
import { parse, stringify } from "query-string";
import { Box, Flexbox, Page, Text } from "cosmo";
import Charts from "./Charts";
import { RequestRejected } from "../../components";
import { Verify } from "../../resources/fastly/verify";
import RealTimeDatacenterSelect from "../../components/RealTimeDatacenterSelect";
import _ from "lodash";

import type { OnChange as HandleDatacenterChange } from "../../components/RealTimeDatacenterSelect";
import type { OnUpdate as HandleDatacenterUpdate } from "../../components/RealTimeDatacenterSelect";
import type { OnChange as HandleTimeRangeChange } from "../../components/TimerangePresets";
import type { OnChange as HandleServiceChange } from "../../resources/fastly/services/Services/Select";

type Props = {};

function FastlyRealTimePage(props: Props): React.Node {
  const history = useHistory();
  const search = useLocation().search;
  const params = useParams();
  const query = parse(search);
  const match = useRouteMatch();

  const { serviceId } = params;
  const { datacenter="" } = query;

  const [datacenters, setDatacenters] = React.useState([]);

  const handleDatacenterUpdate: HandleDatacenterUpdate = (datacenters) => {
    setDatacenters(datacenters);
  };

  const handleDatacenterChange: HandleDatacenterChange = (datacenter) => {
    history.push({
      search: stringify({
        ...query,
        datacenter,
      }),
    });
  };

  const handleTimerangeChange: HandleTimeRangeChange = (timerange) => {
    const { from, until } = timerange;
    history.push({
      search: stringify({
        ...query,
        from,
        until,
        datacenter,
      }),
    });
  };

  const handleServiceChange: HandleServiceChange = (serviceId) => {
    const pathname = generatePath(match.path, { serviceId });
    history.push({
      pathname,
      search: stringify(_.omit(query, ['from', 'until', 'datacenter'])),
    });
  };

  if (!serviceId) {
    return (
      <Verify query={{ active_services_only: true }}>
        {(rsrc) => {
          const { state } = rsrc;

          if (state.rejected)
            return <RequestRejected reason={state.reason.message} />;
          if (state.pending) return null;

          const { services } = state.value;

          const serviceIds = Object.keys(services);
          if (serviceIds.length === 0)
            return <RequestRejected reason="No services found for this user" />;

          return <Redirect to={`/realtime/${serviceIds[0]}`} />;
        }}
      </Verify>
    );
  }

  return (
    <Page>
      <Page.Header>
        <Flexbox
          alignItems="flex-start"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Box marginBottom="xs">
            <Flexbox alignItems="flex-start" flexWrap="wrap" gap="md">
              <Page.Title>
                <Text style={{ whiteSpace: "nowrap" }}>Fastly</Text>
              </Page.Title>
              <Box minWidth="250px" maxWidth="350px">
                <Verify query={{ active_services_only: true }}>
                  {(rsrc) => (
                    <Verify.ServiceSelect
                      label=""
                      resource={rsrc}
                      onChange={handleServiceChange}
                      value={serviceId}
                    />
                  )}
                </Verify>
              </Box>
              <Box minWidth="250px" maxWidth="350px">
                <RealTimeDatacenterSelect
                  datacenters={datacenters}
                  onChange={handleDatacenterChange}
                  value={datacenter}
                />
              </Box>
            </Flexbox>
          </Box>
        </Flexbox>
      </Page.Header>
      <Page.Body>
        <Charts 
          key={serviceId}
          params={{ serviceId, datacenter }} 
          query={query}
          onTimerangeChange={handleTimerangeChange}
          onDatacentersUpdated={handleDatacenterUpdate}
        />
      </Page.Body>
    </Page>
  );
}

export default FastlyRealTimePage;
