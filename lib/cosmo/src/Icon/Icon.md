### Our icon set

Signal Sciences uses a subset of icons from
[Google's Material Icons](https://material.io/tools/icons/?style=baseline).

The icons currently in the product are separated out in our Figma library to
make them easier to browse and reuse. If an existing in-product icon doesn't
make sense for a new use case, check to see if there's an alternative in the
larger Material library that will work. If nothing in the Material library makes
sense, consult the design team for guidance.

Additionally, in support of our **Champion Visibility** and **Reduce
Uncertainty** design principles, Signal Sciences uses icons as a way to enhance
quick understanding of ideas in our platform. For the most part they should be
thought of as an enhancement to, rather than a replacement for, text
descriptions of key information.

### When to use an icon

_For when to use or avoid, refer to these best practices from the Nielsen/Normal
Group_:
[Icon usability guidelines](https://www.nngroup.com/articles/icon-usability/)

**TLDR:** "A user’s understanding of an icon is based on previous experience.
Due to the absence of a standard usage for most icons, text labels are necessary
to communicate meaning and reduce ambiguity".

### Examples

The `<Icon />` component renders Material UI glyphs.

```jsx
import { Text } from "cosmo-ui";

<React.Fragment>
  <Text fontSize="xl" title="AccessTime" style={{ marginRight: 16 }}>
    <Icon glyph="AccessTime" />
  </Text>
  <Text fontSize="xl" title="AddCircle" style={{ marginRight: 16 }}>
    <Icon glyph="AddCircle" />
  </Text>
  <Text fontSize="xl" title="Announcement" style={{ marginRight: 16 }}>
    <Icon glyph="Announcement" />
  </Text>
  <Text fontSize="xl" title="ArrowBack" style={{ marginRight: 16 }}>
    <Icon glyph="ArrowBack" />
  </Text>
  <Text fontSize="xl" title="ArrowDownward" style={{ marginRight: 16 }}>
    <Icon glyph="ArrowDownward" />
  </Text>
  <Text fontSize="xl" title="ArrowDropDown" style={{ marginRight: 16 }}>
    <Icon glyph="ArrowDropDown" />
  </Text>
  <Text fontSize="xl" title="ArrowDropUp" style={{ marginRight: 16 }}>
    <Icon glyph="ArrowDropUp" />
  </Text>
  <Text fontSize="xl" title="ArrowForward" style={{ marginRight: 16 }}>
    <Icon glyph="ArrowForward" />
  </Text>
  <Text fontSize="xl" title="ArrowUpward" style={{ marginRight: 16 }}>
    <Icon glyph="ArrowUpward" />
  </Text>
  <Text fontSize="xl" title="Block" style={{ marginRight: 16 }}>
    <Icon glyph="Block" />
  </Text>
  <Text fontSize="xl" title="Cancel" style={{ marginRight: 16 }}>
    <Icon glyph="Cancel" />
  </Text>
  <Text fontSize="xl" title="Check" style={{ marginRight: 16 }}>
    <Icon glyph="Check" />
  </Text>
  <Text fontSize="xl" title="CheckCircle" style={{ marginRight: 16 }}>
    <Icon glyph="CheckCircle" />
  </Text>
  <Text fontSize="xl" title="Close" style={{ marginRight: 16 }}>
    <Icon glyph="Close" />
  </Text>
  <Text fontSize="xl" title="Clock" style={{ marginRight: 16 }}>
    <Icon glyph="Clock" />
  </Text>
  <Text fontSize="xl" title="CloudDownload" style={{ marginRight: 16 }}>
    <Icon glyph="CloudDownload" />
  </Text>
  <Text fontSize="xl" title="Copy" style={{ marginRight: 16 }}>
    <Icon glyph="Copy" />
  </Text>
  <Text fontSize="xl" title="DeleteForever" style={{ marginRight: 16 }}>
    <Icon glyph="DeleteForever" />
  </Text>
  <Text fontSize="xl" title="Download" style={{ marginRight: 16 }}>
    <Icon glyph="Download" />
  </Text>
  <Text fontSize="xl" title="Dvr" style={{ marginRight: 16 }}>
    <Icon glyph="Dvr" />
  </Text>
  <Text fontSize="xl" title="Edit" style={{ marginRight: 16 }}>
    <Icon glyph="Edit" />
  </Text>
  <Text fontSize="xl" title="Ethernet" style={{ marginRight: 16 }}>
    <Icon glyph="Ethernet" />
  </Text>
  <Text fontSize="xl" title="Eye" style={{ marginRight: 16 }}>
    <Icon glyph="Eye" />
  </Text>
  <Text fontSize="xl" title="FileDownload" style={{ marginRight: 16 }}>
    <Icon glyph="FileDownload" />
  </Text>
  <Text fontSize="xl" title="Flag" style={{ marginRight: 16 }}>
    <Icon glyph="Flag" />
  </Text>
  <Text fontSize="xl" title="Fullscreen" style={{ marginRight: 16 }}>
    <Icon glyph="Fullscreen" />
  </Text>
  <Text fontSize="xl" title="FullscreenExit" style={{ marginRight: 16 }}>
    <Icon glyph="FullscreenExit" />
  </Text>
  <Text fontSize="xl" title="Group" style={{ marginRight: 16 }}>
    <Icon glyph="Group" />
  </Text>
  <Text fontSize="xl" title="Info" style={{ marginRight: 16 }}>
    <Icon glyph="Info" />
  </Text>
  <Text fontSize="xl" title="Input" style={{ marginRight: 16 }}>
    <Icon glyph="Input" />
  </Text>
  <Text fontSize="xl" title="KeyboardArrowDown" style={{ marginRight: 16 }}>
    <Icon glyph="KeyboardArrowDown" />
  </Text>
  <Text fontSize="xl" title="KeyboardArrowLeft" style={{ marginRight: 16 }}>
    <Icon glyph="KeyboardArrowLeft" />
  </Text>
  <Text fontSize="xl" title="KeyboardArrowRight" style={{ marginRight: 16 }}>
    <Icon glyph="KeyboardArrowRight" />
  </Text>
  <Text fontSize="xl" title="KeyboardArrowUp" style={{ marginRight: 16 }}>
    <Icon glyph="KeyboardArrowUp" />
  </Text>
  <Text fontSize="xl" title="Label" style={{ marginRight: 16 }}>
    <Icon glyph="Label" />
  </Text>
  <Text fontSize="xl" title="Link" style={{ marginRight: 16 }}>
    <Icon glyph="Link" />
  </Text>
  <Text fontSize="xl" title="Menu" style={{ marginRight: 16 }}>
    <Icon glyph="Menu" />
  </Text>
  <Text fontSize="xl" title="ModeEdit" style={{ marginRight: 16 }}>
    <Icon glyph="ModeEdit" />
  </Text>
  <Text fontSize="xl" title="MoreHoriz" style={{ marginRight: 16 }}>
    <Icon glyph="MoreHoriz" />
  </Text>
  <Text fontSize="xl" title="MoreVert" style={{ marginRight: 16 }}>
    <Icon glyph="MoreVert" />
  </Text>
  <Text fontSize="xl" title="MultilineChart" style={{ marginRight: 16 }}>
    <Icon glyph="MultilineChart" />
  </Text>
  <Text fontSize="xl" title="Notifications" style={{ marginRight: 16 }}>
    <Icon glyph="Notifications" />
  </Text>
  <Text fontSize="xl" title="Person" style={{ marginRight: 16 }}>
    <Icon glyph="Person" />
  </Text>
  <Text fontSize="xl" title="PersonAdd" style={{ marginRight: 16 }}>
    <Icon glyph="PersonAdd" />
  </Text>
  <Text fontSize="xl" title="PhonelinkLock" style={{ marginRight: 16 }}>
    <Icon glyph="PhonelinkLock" />
  </Text>
  <Text fontSize="xl" title="Power" style={{ marginRight: 16 }}>
    <Icon glyph="Power" />
  </Text>
  <Text fontSize="xl" title="RemoveRedEye" style={{ marginRight: 16 }}>
    <Icon glyph="RemoveRedEye" />
  </Text>
  <Text fontSize="xl" title="Search" style={{ marginRight: 16 }}>
    <Icon glyph="Search" />
  </Text>
  <Text fontSize="xl" title="Security" style={{ marginRight: 16 }}>
    <Icon glyph="Security" />
  </Text>
  <Text fontSize="xl" title="Settings" style={{ marginRight: 16 }}>
    <Icon glyph="Settings" />
  </Text>
  <Text fontSize="xl" title="SettingsEthernet" style={{ marginRight: 16 }}>
    <Icon glyph="SettingsEthernet" />
  </Text>
  <Text fontSize="xl" title="SigSciMove" style={{ marginRight: 16 }}>
    <Icon glyph="SigSciMove" />
  </Text>
  <Text fontSize="xl" title="SigSciTVChart" style={{ marginRight: 16 }}>
    <Icon glyph="SigSciTVChart" />
  </Text>
  <Text fontSize="xl" title="Star" style={{ marginRight: 16 }}>
    <Icon glyph="Star" />
  </Text>
  <Text fontSize="xl" title="Timeline" style={{ marginRight: 16 }}>
    <Icon glyph="Timeline" />
  </Text>
  <Text fontSize="xl" title="Tune" style={{ marginRight: 16 }}>
    <Icon glyph="Tune" />
  </Text>
  <Text fontSize="xl" title="Shield" style={{ marginRight: 16 }}>
    <Icon glyph="Shield" />
  </Text>
  <Text fontSize="xl" title="VerifiedUser" style={{ marginRight: 16 }}>
    <Icon glyph="VerifiedUser" />
  </Text>
  <Text fontSize="xl" title="ViewCarousel" style={{ marginRight: 16 }}>
    <Icon glyph="ViewCarousel" />
  </Text>
  <Text fontSize="xl" title="VpnKey" style={{ marginRight: 16 }}>
    <Icon glyph="VpnKey" />
  </Text>
  <Text fontSize="xl" title="Warning" style={{ marginRight: 16 }}>
    <Icon glyph="Warning" />
  </Text>
</React.Fragment>;
```
