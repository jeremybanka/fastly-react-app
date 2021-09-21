// @flow

import * as React from "react";
import {
  useHistory,
  useLocation,
  useParams,
  generatePath,
  useRouteMatch,
  Redirect,
} from "react-router-dom";
import { parse, stringify } from "query-string";
import { Box, Flexbox, Page, Text } from "cosmo";
import {
  RequestRejected,
  TimerangeDisplay,
  TimerangePresets,
} from "../../components";
import FastlyDomainsCharts from "./Charts";
import RegionSelect from "./RegionSelect";
import { Verify } from "../../resources/fastly/verify";

import type { OnChange as HandleServiceChange } from "../../resources/fastly/services/Services/Select";
import type { OnChange as HandleTimeRangeChange } from "../../components/TimerangePresets";
import type { OnChange as HandleRegionChange } from "./RegionSelect";

type Props = {};
function FastlyDomainsPage(props: Props): React.Node {
  const history = useHistory();
  const params = useParams();
  const search = useLocation().search;
  const match = useRouteMatch();

  const { serviceId } = params;
  const query = parse(search);
  const {
    from = (Date.now() - 24 * 60 * 60 * 1000).toString(), // -1d
    until = "",
    region = "all",
  } = query;

  const handleTimerangeChange: HandleTimeRangeChange = (timerange) => {
    const { from, until } = timerange;
    history.push({
      search: stringify({
        ...query,
        from,
        until,
      }),
    });
  };

  const handleRegionChange: HandleRegionChange = (region) => {
    history.push({
      search: stringify({
        ...query,
        region,
      }),
    });
  };

  const handleServiceChange: HandleServiceChange = (serviceId) => {
    const pathname = generatePath(match.path, { serviceId });
    history.push({
      pathname,
      search,
    });
  };

  // fastly API expects timestamp in seconds
  const fromSecs = parseInt(Number(from) / 1000, 10).toString();
  const toSecs =
    !until || isNaN(until) ? "" : parseInt(Number(until) / 1000, 10).toString();

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

          return <Redirect to={`/domains/${serviceIds[0]}`} />;
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
                      resource={rsrc}
                      onChange={handleServiceChange}
                      value={serviceId}
                    />
                  )}
                </Verify>
              </Box>
              <Box minWidth="250px" maxWidth="350px">
                <RegionSelect value={region} onChange={handleRegionChange} />
              </Box>
            </Flexbox>
          </Box>
          <Box>
            <TimerangePresets onChange={handleTimerangeChange} />
            <Box marginBottom="sm" />
            <Flexbox justifyContent="flex-end">
              <TimerangeDisplay timerange={{ from, until }} />
            </Flexbox>
          </Box>
        </Flexbox>
      </Page.Header>
      <Page.Body>
        <FastlyDomainsCharts
          params={{ serviceId }}
          query={{ start: fromSecs, end: toSecs, region }}
          onTimerangeChange={handleTimerangeChange}
        />
      </Page.Body>
    </Page>
  );
}

export default FastlyDomainsPage;
