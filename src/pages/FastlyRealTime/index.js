// @flow

import * as React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { parse, stringify } from "query-string";
import { Box, Flexbox, Page, Text } from "cosmo";
import Charts from "./Charts";

import type { OnChange as HandleTimeRangeChange } from "../../components/TimerangePresets";

type Props = {};
const serviceId: string = '1jlmtMz1ncwA0KC3TBGD0X';

function FastlyRealTimePage(props: Props): React.Node {
  const history = useHistory();
  const search = useLocation().search;
  const query = parse(search);

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
                <Text style={{ whiteSpace: "nowrap" }}>Fastly Real-Time</Text>
              </Page.Title>
            </Flexbox>
          </Box>
        </Flexbox>
      </Page.Header>
      <Page.Body>
        <Charts 
          params={{ serviceId }} 
          query={query}
          onTimerangeChange={handleTimerangeChange}
        />
      </Page.Body>
    </Page>
  );
}

export default FastlyRealTimePage;
