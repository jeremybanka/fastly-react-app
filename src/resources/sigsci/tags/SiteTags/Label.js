// @flow

import * as React from "react";

type Props = {
  resource: Object,
  tagName: string,
};

const Label = (props: Props): React.Node => {
  const { resource, tagName } = props;
  const { state } = resource;

  if (state.pending || state.rejected) return tagName;

  const { data } = state.value;
  const tag = data ? data.find((t) => t.tagName === tagName) : null;

  return tag && tag.shortName ? tag.shortName : tagName;
};

export default Label;
