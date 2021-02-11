/* @flow */

import styled, {
  createGlobalStyle,
  ThemeProvider,
  ThemeConsumer,
} from "styled-components";
import { themeGet } from "@styled-system/theme-get";
import css from "@styled-system/css";
import { IntlProvider } from "react-intl";

import Alert from "./Alert";
// import Blankslate from "./Blankslate";
// import Blockquote from "./Blockquote";
import Box from "./Box";
// import BreadcrumbNav from "./BreadcrumbNav";
import Button from "./Button";
// import Callout from "./Callout";
import Card from "./Card";
// import Checkbox from "./Checkbox";
// import CheckboxInput from "./CheckboxInput";
// import Code from "./Code";
// import Codeblock from "./Codeblock";
// import ConfirmationDialog from "./ConfirmationDialog";
// import CopyToClipboard from "./CopyToClipboard";
// import Counter from "./Counter";
// import CRUDPageHeader from "./CRUDPageHeader";
// import DataTable from "./DataTable";
// import DefinitionList from "./DefinitionList";
// import DescriptionList from "./DescriptionList";
import Dot from "./Dot";
// import DurationInput from "./DurationInput";
// import EmojiFlag from "./EmojiFlag";
// import FastlyBanner from "./FastlyBanner";
// import FilterPanel from "./FilterPanel";
// import Flex from "./Flex";
import Flexbox from "./Flexbox";
// import FlexLayout from "./FlexLayout";
import Form from "./Form";
import FormattedBytes, { formatBytes } from "./FormattedBytes";
import FormattedDate from "./FormattedDate";
import FormattedDateRange from "./FormattedDateRange";
import FormattedDateTime from "./FormattedDateTime";
// import FormattedDuration from "./FormattedDuration";
// import FormattedIp from "./FormattedIp";
import FormattedNumber, { formatNumber } from "./FormattedNumber";
import FormattedPercent, { formatPercent } from "./FormattedPercent";
// import FormattedPercentChange from "./FormattedPercentChange";
// import FormattedRedaction from "./FormattedRedaction";
// import FormattedRelative from "./FormattedRelative";
import FormattedTime from "./FormattedTime";
import FormattedTimeRange from "./FormattedTimeRange";
// import FormDebug from "./FormDebug";
// import Grid from "./Grid";
import Icon from "./Icon";
import InputError from "./InputError";
import InputHelper from "./InputHelper";
import InputLabel from "./InputLabel";
import InputValue from "./InputValue";
import InputValueHelper from "./InputValueHelper";
// import Link from "./Link";
// import LinkButton from "./LinkButton";
// import List from "./List";
// import Loader from "./Loader";
// import LogoIcon from "./LogoIcon";
// import Markdown from "./Markdown";
// import Modal from "./Modal";
// import ModalNew from "./ModalNew";
// import Notif from "./Notif";
import Page from "./Page";
// import Pager from "./Pager";
// import Pjax from "./Pjax";
// import Popover from "./Popover";
// import Radio from "./Radio";
// import RadioCapsule from "./RadioCapsule";
import RadioInput from "./RadioInput";
// import Select from "./Select";
import SelectInput from "./SelectInput";
// import Signal from "./Signal";
// import Status from "./Status";
import SwitchInput from "./SwitchInput";
import Tab from "./Tab";
// import Table from "./Table";
import Text from "./Text";
// import TextareaInput from "./TextareaInput";
import TextInput from "./TextInput";
// import Tooltip from "./Tooltip";
// import TransitionDropIn from "./TransitionDropIn";
// import Truncated from "./Truncated";
import theme, { getTheme } from "./theme";

export {
  // styled-components
  styled,
  createGlobalStyle,
  ThemeProvider,
  ThemeConsumer,
  // styled-system/css
  css,
  // styled-system/theme-get
  themeGet,
  // react-intl
  IntlProvider,
  // cosmo
  Alert,
  // Blankslate,
  // Blockquote,
  Box,
  // BreadcrumbNav,
  Button,
  // Callout,
  Card,
  // Checkbox,
  // CheckboxInput,
  // Code,
  // Codeblock,
  // ConfirmationDialog,
  // CopyToClipboard,
  // Counter,
  // CRUDPageHeader,
  // DataTable,
  // DefinitionList,
  // DescriptionList,
  Dot,
  // DurationInput,
  // EmojiFlag,
  // FastlyBanner,
  // FilterPanel,
  // Flex,
  Flexbox,
  // FlexLayout,
  Form,
  FormattedBytes,
  formatBytes,
  FormattedDate,
  FormattedDateRange,
  FormattedDateTime,
  // FormattedDuration,
  // FormattedIp,
  FormattedNumber,
  formatNumber,
  FormattedPercent,
  formatPercent,
  // FormattedPercentChange,
  // FormattedRedaction,
  // FormattedRelative,
  FormattedTime,
  FormattedTimeRange,
  // FormDebug,
  // Grid,
  Icon,
  InputError,
  InputHelper,
  InputLabel,
  InputValue,
  InputValueHelper,
  // Link,
  // LinkButton,
  // List,
  // Loader,
  // LogoIcon,
  // Markdown,
  // Modal,
  // ModalNew,
  // Notif,
  Page,
  // Pager,
  // Pjax,
  // Popover,
  // Radio,
  // RadioCapsule,
  RadioInput,
  // Select,
  SelectInput,
  // Signal,
  // Status,
  SwitchInput,
  Tab,
  // Table,
  Text,
  // TextareaInput,
  TextInput,
  // Tooltip,
  // TransitionDropIn,
  // Truncated,
  theme,
  getTheme,
};
