// @flow

import * as React from "react";
import {
  Box,
  Button,
  Flexbox,
  InputHelper,
  InputLabel,
  RadioInput,
  TextInput,
} from "cosmo";
import { SiteTags } from "../resources/sigsci/tags";
import { FastlyMetricSelect } from "./";

type Props = {
  formValues: Object,
  api: "sigsci" | "fastly",
  params: {
    siteName: string,
  },
  onInputChange: (key: string, value: string | string[]) => void,
  onSubmit: () => void,
  onReset: () => void,
};

function ChartConfig(props: Props): React.Node {
  const { formValues, api, params, onInputChange, onSubmit, onReset } = props;
  const { title, subtitle, metrics, chartType, format } = formValues;

  return (
    <form>
      <Box marginBottom="md">
        <TextInput
          label="Title"
          input={{
            id: "title",
            name: "title",
            value: title,
            required: true,
            onChange: (e) => onInputChange("title", e.currentTarget.value),
          }}
        />
      </Box>
      <Box marginBottom="md">
        <TextInput
          label="Subtitle"
          input={{
            id: "subtitle",
            name: "subtitle",
            value: subtitle,
            required: true,
            onChange: (e) => onInputChange("subtitle", e.currentTarget.value),
          }}
        />
      </Box>
      <Box marginBottom="md">
        <Box marginBottom="xs">
          <InputLabel htmlFor="metrics">Metrics</InputLabel>
        </Box>
        {api === "sigsci" ? (
          <SiteTags params={{ siteName: params.siteName }}>
            {(rsrc) => (
              <SiteTags.Select
                resource={rsrc}
                value={metrics}
                onChange={(options) =>
                  onInputChange(
                    "metrics",
                    options.map((v) => v.value)
                  )
                }
              />
            )}
          </SiteTags>
        ) : (
          <FastlyMetricSelect
            value={metrics}
            onChange={(options) =>
              onInputChange(
                "metrics",
                options.map((v) => v.value)
              )
            }
          />
        )}
      </Box>
      <Box marginBottom="xs">
        <InputLabel>Style</InputLabel>
      </Box>
      <Box marginBottom="md">
        <RadioInput
          label="Bar"
          input={{
            name: "chartType",
            id: "chartTypeBar",
            value: "bar",
            checked: chartType === "bar",
            onChange: () => onInputChange("chartType", "bar"),
          }}
        />
      </Box>
      <Box marginBottom="md">
        <RadioInput
          label="Line"
          input={{
            name: "chartType",
            id: "chartTypeLine",
            value: "line",
            checked: chartType === "line",
            onChange: () => onInputChange("chartType", "line"),
          }}
        />
      </Box>

      <Box marginBottom="xs">
        <InputLabel>Format</InputLabel>
      </Box>
      <Box marginBottom="md">
        <RadioInput
          label="Number"
          input={{
            name: "format",
            id: "formatNumber",
            value: "number",
            checked: format === "number",
            onChange: () => onInputChange("format", "number"),
          }}
        />
      </Box>
      <Box marginBottom="md">
        <RadioInput
          label="Bytes"
          input={{
            name: "format",
            id: "formatBytes",
            value: "bytes",
            checked: format === "bytes",
            onChange: () => onInputChange("format", "bytes"),
          }}
        />
      </Box>
      <Box marginBottom="md">
        <RadioInput
          label="Percent"
          input={{
            name: "format",
            id: "formatPercent",
            value: "percent",
            checked: format === "percent",
            onChange: () => onInputChange("format", "percent"),
          }}
        />
      </Box>

      <Flexbox>
        <Button size="sm" onClick={onSubmit}>
          Done
        </Button>
        <Box marginRight="md" />
        <Button size="sm" variant="secondary" onClick={onReset}>
          Reset
        </Button>
      </Flexbox>
      <Box marginTop="xs" fontSize="xxs">
        <InputHelper>Note: data is saved in local storage</InputHelper>
      </Box>
    </form>
  );
}

export default ChartConfig;
