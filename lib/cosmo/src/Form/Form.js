/* @flow */

import * as React from "react";
import { Box } from "../";
import FormActions from "./FormActions";
import FormBody from "./FormBody";
import FormHeader from "./FormHeader";
import FormSection from "./FormSection";
import FormTitle from "./FormTitle";
import FormSubtitle from "./FormSubtitle";

type Props = {
  children: React.Node,
  onSubmit: (any) => void | Promise<*>,
};

const Form = (props: Props) => {
  // this smells
  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSubmit(event);
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      {props.children}
    </Box>
  );
};

Form.Actions = FormActions; // rename Form.Footer?
Form.Body = FormBody;
Form.Header = FormHeader;
Form.Section = FormSection; // define intended usage
Form.Title = FormTitle;
Form.Subtitle = FormSubtitle; // candidate for removal?

export default Form;
