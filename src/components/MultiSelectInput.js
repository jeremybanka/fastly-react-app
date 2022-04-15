import * as React from "react"

import { Box, Text, ThemeConsumer } from "cosmo"
import Select, { components } from "react-select"

/*
export type OptionType = {
  value: string,
  label: string,
  description: string,
};
type Props = {
  value: string[],
  options: OptionType[],
  isLoading?: boolean,
  onChange: (options: OptionType[]) => void,
};
*/

const Option = (optionProps) => {
  const { data } = optionProps
  const { Option } = components

  return (
    <Option {...optionProps}>
      <Text fontWeight="semibold">
        {data.label}
        {data.description ? (
          <Box>
            <Text fontSize="xxs" fontWeight="normal">
              {data.description}
            </Text>
          </Box>
        ) : null}
      </Text>
    </Option>
  )
}

const filterOptions = (option, searchText) => {
  const { value, label, description } = option.data
  return (
    value.toLowerCase().includes(searchText.toLowerCase()) ||
    label.toLowerCase().includes(searchText.toLowerCase()) ||
    description.toLowerCase().includes(searchText.toLowerCase())
  )
}

const MultiSelectInput = (props) => {
  const { value, onChange, options, isLoading = false } = props

  return (
    <ThemeConsumer>
      {(theme) => (
        <Select
          value={value.map((v) => options.find((d) => d.value === v))}
          options={options}
          onChange={onChange}
          components={{ Option: Option }}
          filterOption={filterOptions}
          isLoading={isLoading}
          theme={(componentTheme) => ({
            ...componentTheme,
            transition: 0,
            borderRadius: 0,
            colors: {
              ...componentTheme.colors,
              neutral0: theme.colors.grays[0],
              neutral5: theme.colors.grays[0],
              neutral10: theme.colors.grays[1],
              neutral20: theme.colors.grays[2],
              neutral30: theme.colors.grays[3],
              neutral40: theme.colors.grays[4],
              neutral50: theme.colors.grays[5],
              neutral60: theme.colors.grays[6],
              neutral70: theme.colors.grays[7],
              neutral80: theme.colors.grays[8],
              neutral90: theme.colors.grays[8],
              primary: theme.colors.grays[5],
              primary25: theme.colors.grays[1],
              primary50: theme.colors.grays[2],
              primary75: theme.colors.grays[5],
              danger: theme.colors.reds[5],
              dangerLight: theme.colors.reds[1],
            },
            spacing: {
              ...componentTheme.spacing,
              baseUnit: theme.space.xs,
              menuGutter: theme.space.xs,
            },
          })}
          isMulti
        />
      )}
    </ThemeConsumer>
  )
}

export default MultiSelectInput
