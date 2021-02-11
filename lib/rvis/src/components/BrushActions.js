// @flow

// eslint-disable-next-line import/no-unresolved
import * as React from "react";
import { Text } from "@visx/text";
import { ChartContext } from "../ChartProvider";
import type { BrushActionsProps } from "../types";

function BrushActions(props: BrushActionsProps): React.Node {
  const { xMax, theme, onApplyBrush, onClearBrush } = props;
  const { colors, fonts, space } = theme;

  const { brushRange } = React.useContext(ChartContext);

  const handleApplyBrush = () => {
    onClearBrush();
    onApplyBrush(brushRange);
  };

  const buttonWidth = space.small * 9;
  const buttonHeight = space.small * 3;
  const margin = space.small;
  const fontSize = buttonHeight / 2;

  return brushRange.start && brushRange.end ? (
    <>
      {onApplyBrush ? (
        <g onClick={handleApplyBrush}>
          <rect
            x={xMax - buttonWidth * 2 - margin * 2}
            y={margin}
            width={buttonWidth}
            height={buttonHeight}
            fill={colors.muted}
          />
          <Text
            x={xMax - buttonWidth * 2 - margin * 2 + buttonWidth / 2}
            y={margin + buttonHeight / 2}
            width={buttonWidth}
            height={buttonHeight}
            fill={colors.text}
            fontFamily={fonts.sans}
            fontSize={fontSize}
            verticalAnchor="middle"
            textAnchor="middle"
          >
            Apply
          </Text>
        </g>
      ) : null}

      <g onClick={onClearBrush}>
        <rect
          x={xMax - (buttonWidth + margin)}
          y={margin}
          width={buttonWidth}
          height={buttonHeight}
          fill={colors.muted}
        />
        <Text
          x={xMax - buttonWidth / 2 - margin}
          y={margin + buttonHeight / 2}
          width={buttonWidth}
          height={buttonHeight}
          fill={colors.text}
          fontFamily={fonts.sans}
          fontSize={fontSize}
          textAnchor="middle"
          verticalAnchor="middle"
        >
          Reset
        </Text>
      </g>
    </>
  ) : null;
}

export default BrushActions;
