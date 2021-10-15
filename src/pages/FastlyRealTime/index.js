// @flow

import * as React from "react";
import { Box, Flexbox, Page, Text } from "cosmo";
import Charts from "./Charts";

type Props = {};
const serviceId: string = 'demo';

function FastlyRealTimePage(props: Props): React.Node {
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
        <Charts params={{ serviceId }} />
      </Page.Body>
    </Page>
  );
}

export default FastlyRealTimePage;
