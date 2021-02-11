// @flow

import * as React from "react";
import { Box, Text } from "cosmo";

function AuthMissing(): React.Node {
  return (
    <Box backgroundColor="grays.1" padding="md">
      <Text fontWeight="semibold" textAlign="center">
        🔑 Auth credentials missing
      </Text>
      <Box marginBottom="sm" />
      Are your auth credentials present and correct?
    </Box>
  );
}

export default AuthMissing;
