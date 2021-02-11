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
import { Sites } from "../../resources/sigsci/sites";
import { SiteTags } from "../../resources/sigsci/tags";
import SigsciCharts from "./Charts";

import type { OnChange as HandleTimeRangeChange } from "../../components/TimerangePresets";
import type { OnChange as HandleSiteChange } from "../../resources/sigsci/sites/Sites/Select";

type Props = {};
function SigsciPage(props: Props): React.Node {
  const history = useHistory();
  const params = useParams();
  const search = useLocation().search;
  const match = useRouteMatch();

  const { siteName } = params;
  const query = parse(search);
  const {
    from = (Date.now() - 24 * 60 * 60 * 1000).toString(), // -1d
    until = "",
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

  const handleSiteChange: HandleSiteChange = (siteName) => {
    const pathname = generatePath(match.path, { siteName });
    history.push({
      pathname,
      search,
    });
  };

  if (!siteName) {
    return (
      <Sites>
        {(rsrc) => {
          const { state } = rsrc;

          if (state.rejected)
            return <RequestRejected reason={state.reason.message} />;
          if (state.pending) return null;

          const { data } = state.value;

          if (data.length === 0)
            return <RequestRejected reason="No sites found for this user" />;

          return <Redirect to={`/sigsci/${data[0].name}`} />;
        }}
      </Sites>
    );
  }

  return (
    <Page>
      {/* cache Sites and SiteTags early */}
      <Sites />
      <SiteTags params={{ siteName }} />
      <Page.Header>
        <Flexbox
          alignItems="flex-start"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Box marginBottom="xs">
            <Flexbox alignItems="flex-start" flexWrap="wrap" gap="md">
              <Page.Title>
                <Text style={{ whiteSpace: "nowrap" }}>Signal Sciences</Text>
              </Page.Title>
              <Box minWidth="250px" maxWidth="350px">
                <Sites>
                  {(rsrc) => (
                    <Sites.Select
                      resource={rsrc}
                      onChange={handleSiteChange}
                      value={siteName}
                    />
                  )}
                </Sites>
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
        <SigsciCharts
          onTimerangeChange={handleTimerangeChange}
          params={{ siteName }}
          query={{ from, until }}
        />
      </Page.Body>
    </Page>
  );
}

export default SigsciPage;
