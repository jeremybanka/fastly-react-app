/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from "react"

import { Box, Button, InputHelper, TextInput } from "cosmo" // @ts-ignore

import { useHistory } from "react-router-dom"
import useLocalStorage from "../hooks/useLocalStorage"

function AuthConfigFastly() {
  const [storedAuth, setStoredAuth] = useLocalStorage(`fastlyAuth`, {})

  let history = useHistory()

  const handleSubmit = (evt) => {
    evt.preventDefault()
    const accessToken = evt.currentTarget.elements[`fastlyAccessToken`]?.value

    const formData = {
      accessToken,
    }

    setStoredAuth(formData)
    history.push(`/`)

    // HACK to re-render charts. Without it, a new request will not be made
    // since the request will be cached (these values are passed to request
    // headers which do not impact cache validation).
    // We could hash the values and append to the request query but that seems
    // unnecessary/undesirable when we could just refresh in the few instances
    // where this mock auth method might change.
    // setTimeout(() => (window.location.href = `/`), 10)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box marginBottom="md">
        <TextInput
          label="Access token"
          input={{
            id: `fastlyAccessToken`,
            type: `password`,
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
  )
}

export default AuthConfigFastly
