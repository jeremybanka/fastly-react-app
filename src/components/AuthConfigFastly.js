// @flow

import * as React from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { Box, Button, InputHelper, TextInput } from "cosmo";

function AuthConfigFastly(): React.Node {
  const [storedAuth, setStoredAuth] = useLocalStorage("fastlyAuth", {});

  const handleSubmit = (evt) => {
    const accessToken = evt.currentTarget["fastlyAccessToken"].value;

    const formData = {
      accessToken,
    };

    setStoredAuth(formData);
    // HACK to re-render charts. Without it, a new request will not be made
    // since the request will be cached (these values are passed to request
    // headers which do not impact cache validation).
    // We could hash the values and append to the request query but that seems
    // unnecessary/undesirable when we could just refresh in the few instances
    // where this mock auth method might change.
    setTimeout(() => (window.location.href = "/fastly"), 10);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box marginBottom="md">
        <TextInput
          label="Access token"
          input={{
            id: "fastlyAccessToken",
            type: "password",
            defaultValue: storedAuth.accessToken,
            required: true,
          }}
        />
      </Box>
      <Button type="submit" size="sm">
        Update
      </Button>
      <Box marginTop="sm" fontSize="xxs">
        <InputHelper>Note: data is saved in local storage</InputHelper>
      </Box>
    </form>
  );
}

export default AuthConfigFastly;
