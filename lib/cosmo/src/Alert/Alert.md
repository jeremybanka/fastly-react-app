An `Alert` is a message meant to inform the user of important additional context
in the UI. They should be used judiciously since they are intended to draw a
user’s attention toward key information at the right moments.

Alerts live within the page flow of the application and are _not directly
removable_ by the user. An alert may disappear as the result of a change in the
system, but it does not include an ‘X’ to remove it without a state change.

### When to use an alert

- **System messaging.**
- **Tips or informational messages.**

### When to use something else

- **Success Messages.** These are always temporary and should be displayed via a
  `Notif`.
- **Warnings or errors that should be removable by the user.**

---

### Info & Neutral Alerts

Use an info alert to draw the user’s attention to important contextual
information or to provide helpful tips or reminders. Info alerts should be
neutral or positive in tone and there should be no sense of urgency. Use a
neutral alert as a replacement for a blue info alert when the blue style feels
too visually strong or interruptive.

- **Guidelines:**
  - **Icon:** (optional) Use an icon for visual prominence if spacing allows.
  - **Title:** (optional) Use titles as a useful lead summary. Be succinct and
    to the point.
  - **Description:** Ensure that the message is simple and concise, but still
    constructive and helpful. Do not use a description that might alarm the
    user.
  - **Link:** (optional)

### Warning Alert

Use a warning alert for critical or urgent content, or to proactively tell the
user that their future actions may potentially be affected. For example, a
user’s future actions attempting to create a blocking rule would be affected by
setting their site in non-blocking mode. Warning alerts should not be used for
errors. If a user cannot complete a task, use a danger alert instead.

- **Guidelines**
  - **Icon:** (optional) Use an icon for visual prominence if spacing allows.
  - **Title:** (optional) Avoid generic, ambiguous titles that might alarm the
    user. Describe the exact issue.
  - **Description:** Describe the situation clearly and, if applicable, give
    users guidance or next steps.
  - **Link:** (optional) Do not include links in temporary notifs.

### Danger Alerts

Use a danger alert for system-wide errors or for errors that explain why a user
cannot complete a task. Be polite and never place blame on the user. Take extra
care to make sure that the copy does not sound detached or indifferent. Make
sure that the error message is free from technical jargon. (e.g., Problems
parsing JSON)

- **Guidelines**
  - **Icon:** (optional but strongly recommended) Use an icon for visual
    prominence if spacing allows.
  - **Title:** (optional but strongly recommended) Avoid generic, ambiguous
    titles. Describe the exact issue and how it impacts the user’s ability to
    use Signal Sciences.
  - **Description:** Explain to users how they can fix their error.
  - **Link:** (optional)

### Success Alerts

Use success alerts when a user has successfully performed an action. Don’t use
exclamation marks in success messages. Success alerts are most commonly
displayed as a temporary `Notif`.

- **Guidelines**
  - **Icon:** All success alerts should use an icon
  - **Title:** Just use the one word title “Success”
  - **Description:** “Your [item] has been [updated, created, deleted, removed]”
  - **Link:** Do not include links in success messages.
  - _Use these guidelines as a starting point but try to make the message as
    specific as possible. For example, when managing users you should say “[name
    of user] has been updated” instead of “Your user has been updated.”_

### Examples

Alerts without `onDismiss` prop:

```jsx
<Alert variant='info'>
  Hear ye, hear ye! Just for the sake of demonstration I'm going to write a super long, kinda of whispy run-on sentence to show what happens when a message in an alert needs to flow to multiple lines. How'd I do?
</Alert>
<Alert variant='success'>
  Lean green bean machine
</Alert>
<Alert variant='warning'>
  Hatching chick emoji
</Alert>
<Alert variant='danger'>
  They don't think it be like it is, but it do
</Alert>
```

Alerts with `onDismiss` prop:

```jsx
<Alert
  variant="info"
  onDismiss={(event) => {
    console.info("Alert dismissed!", event);
  }}
>
  Alerts accept an `onDismiss` prop
</Alert>
```
