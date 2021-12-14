# CHANGELOG

## v4.3.3
- updates permission set to match IAM service
## v4.3.2
- Bug fix to correct customer data in mirage (for Tango)

## v4.3.1
- Adds additional safegaurds for internal permission checks
- adds an internal legacy role check for internal users

## v4.3.0
- Phase 2 for the Permissions service
- This introduces the ability to check permissions against new eRBAC permissions while allowing for a fallback to legacy RBAC checks

## v4.2.0
- Phase 1 for the Permissions service, `permitted` helper, and the `not-permitted` helper.
- This phase introduces a path for removing direct calls to Ember Can by placing our new service and helpers between our code and Ember Can.
- This adds the logical break between our old RBAC implementation (legacy RBAC) and Enhanced RBAC (eRBAC) but stops just short of implementing the new eRBAC systems which will come in the next phase of this work.

- ## v4.1.2
- Improve the user group factory for testing purposes

## v4.1.1
- Adds support for query params on GET /user-groups mock endpoint

## v4.1.0
- Adds functionality to allow salesadmin users to temporarily change role to admin
- moves back to primary ember-can repo (from forked version) after bug fix was merged

## v4.0.1
- BUGFIX: fix pagination query params in requests and mock server endpoints.

## v4.0.0
- Adds base adapter and serializer for IAM endpoints (api v3 style)
- Add models for IAM endpoints
- Configures Mirage to handle IAM endpoints
- Upgrade Ember.js and related dependencies
- 🔥 remove legacy support for 'sessionToken' in localStorage
- Introduces Dark Mode to the switch customer flow

## v3.0.2
- minor style updates and accessibility improvements

## v3.0.1
- update microcopy

## v3.0.0
* GET /accounts-authorizations is now POST /account-authorizations.

**Breaking change**: consuming applications must update their mirage configs in order to switch accounts in mirage-mode.

```
// mirage/config.js

// change
this.get(`${API_ORIGIN}/account-authorizations`)
// to
this.post(`${API_ORIGIN}/account-authorizations`)
```

## Version 2 will be deprecated
* Support for GET /account-authorizations will be removed.

## 2.16.1
* Checks the correct error object to display helpful error messages when switching accounts errors

## 2.16.0
* Adds new flow allowing user to select authentication method when server responds with a 400, sso url header, and sso_recommended error message

## v2.15.6
* Adds a setter for session.tokenStore

## v2.15.5
* Align sub-headings left.
* Adds role='alert' and dismissible option to FuiAuthError

## v2.15.4
* Changes where a user lands when access to switch-customer child route is denied, opting to send the user to the main page instead of a 404

## v2.15.3
* Shows error when wrong password entered in login flow

## v2.15.2
* Stops removing the current token when attempting switch to SAML account to address bug with disappearing tokens on switch to SAML

## v2.15.1
* Fixes bug in error handling when looking for the SSO header. We need to respond to either a 401 or a 400

## v2.15.0
* Adds new flow for MAUA allowing a user to input their password when switching from SAML token to Password token
* Accessibility improvments
* Additional error states

## v2.14.1
* fix microcopy typo

## v2.14.0
* Adds the structural changes necessary to support Multi-account User Access across all of our applications.
  - A user will receive a token unique for the customer they are viewing; tokens will be stored in a map within localStorage
  - The active token in use will be stored in sessionStorage. This will allow a person to be logged in to multiple customers across multiple tabs at the same time.
* Adds routes and templates to support 2 customer switching flows:
  - customer switching interrupted by the need to 2FA
  - customer switching initiated at the account menu

## v2.13.3
* Fixes layout bug introduced by changes to fui-chrome

## v2.13.2
* 👌🏼Some minor change to design and wording on the elevate-permissions template

## v2.13.1
* ♻️ When the ensure session call fails we now pass along the error response or the constant `API_UNREACHABLE` (can be imported into consuming apps for use) if the failure is not an expected case. This allows for consuming apps to handle these errors how they see fit.

## v2.13.0
* ✨ The `elevate-permissions` route will now throw a 404 if directly loaded or user is coming from anywhere that is not extending the `requires-sudo-route` route helper.
* ✨ Adds additional message to the `elevate-permissions` template

## v2.12.3
* ✨ When we force the customerId onto the URL we now check for `fui-admin`s context in local storage and default to the customer in session vs always forcing the customer in session

## v2.12.2
* 🐛 Catch an API outage and allow for graceful handling

## v2.12.1
* 🐛 Fix bug caused by unexpected response structure

## v2.12.0

* ✨ Add functionality for elevating a user's permissions to `sudo`:
    * new sudo methods in `class:session`; `session#enableSudoPassword` and `session#enableSudoSaml`
    * `route:elevate-permissions`
    * `route:requires-sudo`
    * `component:fui-sudo-field`

## v2.11.0
* ✨ Automatically redirect a SAML user to their IDP for re-authentication when their session token has expired

## v2.10.3
* 🐛 Fix sso reauth button when signing in with expired sso token
* 🐛 Fix extra sso url segments on redirect to sso reauth in umbrella

## v2.10.2

* 🐛 Fix status check code on ajax requests to ensure `signOutOn401` behavior works as expected

## v2.10.1

* 🐛 Fix 503 on capabilities resulting in unpreventable sign out

## v2.10.0

* ✨ Expose `signOutOn401` option on `session#signOut` to library consumers

## v2.9.0

* Update `DEFAULT_AUTH_PATH` to `/auth/sign-in` (use umbrella-auth instead of tango for auth by default)

## v2.8.0

* Upgrade `ember-can` to `^1.0.0`

## v2.7.0

* Change `fastly-client` to `fastly-ui-client` to avoid conflict with internal tools

## v2.6.0

* ✨ Send `fastly-client` header on all AJAX requests

## v2.5.2

* 🐛 Fix sudo status of tokens not being persisted into `localStorage`

## v2.5.1

* 🐛 Fix `ssoLoginUrl` not being stored as a valid JSON string (via `JSON.stringify`)

## v2.5.0

* ✨ Add option to pass `{includeServices: true}` to `ensureSession` to include services in response from `GET /verify` and store them on `Session#serviceIdsToNames`
* ✨ Add option to pass `{ssoLoginUrl: 'foo'}` to `signOut` to specify an SSO/SAML endpoint for re-auth for users who have SSO sessions, AND/OR automatically grab the `ssoLoginUrl` from the `Fastly-SSO-Login-Url` response header on `DELETE /token`

## v2.4.1

* Ensure that `session#user` and `session#customer` are properly populated, even if they were `get`-ed before a valid
  session exists. Fixes [APPENG-1211](https://jira.corp.fastly.com/browse/APPENG-1211)

## v2.4.0

* Add optional support for [ember-feature-flags](https://github.com/kategengler/ember-feature-flags)

## v2.3.0

* Adds `authPath` to make the path that `didSignOut` redirects to configurable via ember config or environment variable

## v2.2.0

* use `window.history` to ensure that internal users have a `?customerId` query-param and external customers do not

## v2.1.2

* Doing proper creation of Ember Data objects so that other attributes such as `emailHash` come through
