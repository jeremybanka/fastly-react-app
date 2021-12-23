import * as React from "react"

import { Box, SwitchInput } from "cosmo"

/*
type Props = {
  theme: string,
  onChange: (themeName: string) => void,
};
*/

function ThemePicker(props) {
  const { theme, onChange } = props

  return (
    <Box>
      <SwitchInput
        label="Dark mode"
        input={{
          id: "theme",
          name: "theme",
          value: "dark",
          checked: theme === "dark",
          onChange: () => {
            onChange(theme === "dark" ? "light" : "dark")
          },
        }}
      />
    </Box>
  )
}

export default ThemePicker
