# fastly-auth

## Installation

```sh
$ npm install --save-dev @fastly/auth
```

## Usage

### Required:
* Node.js v10 or above

### In an Ember App
* Ember.js v3.16 or above
* Ember CLI v2.13 or above

This library is available as an Ember Addon, so everything is set up for you.

```js
// route:application
export default Ember.Route.extend({
  session: Ember.inject.service(),

  model() {
    return this.get('session').ensureSession();
  }
});
```

### With Ember-Data

Be sure to also follow the
[instructions](https://github.com/ember-cli/ember-ajax/#usage-with-ember-data)
for making ember-data aware of ember-ajax. Any adapter that includes
`ember-ajax/mixins/ajax-support` will be able to make authenticated requests.

`service:session#customer` will be an instance of `model:customer` and `#user`
an instance of `model:user`. If your application doesn't otherwise have these
models, you can export the barebones ones provided by this library:

```js
// app/models/customer.js
export { default } from '@fastly/auth/models/customer'
```

### With ember-feature-flags

[ember-feature-flags](https://github.com/kategengler/ember-feature-flags) is an
optional dependency. If it's available, loading a session will populate
`service:features`.

### In a Non-Ember App

 1. import `addon/session.js`; you may need to use a combination of [Babel](https://babeljs.io/), [rollup.js](https://rollupjs.org/), and [webpack](https://webpack.js.org/) to make the library consumable in the browser
 2. Create a new instance of `@fastly/auth/session`

## Configuration

### API Origin

FastlyAuth makes AJAX requests via CORS. By default, this value is

 * `"https://api.fastly.com"` for non-ember applications
 * `"https://api.fastly.com"` for ember applications in production
 * `"https://api.fastly.test"` for ember applications in test
 * `"http://api.dev.local"` for ember applications in development

You can override the value in a few ways:

 * ember applications can specify a `FASTLY_API_ORIGIN` environment variable
 * ember applications can set `config['fastly-auth'].apiOrigin`
 * any application can pass an `apiOrigin` when creating an instance of `@fastly/auth/session`

### Authentication Path

FastlyAuth by default assumes that your application will use [Umbrella Auth](https://github.com/fastly/umbrella-auth) for authentication. It will automatically redirect the user to `/auth/sign-in` when:

  * `service:session.signOut()` is called in ember applications
  * `@fastly/auth/session.signOut()` is called in non-ember applications
  * `service:session.ensureSession()` errors/catches in ember applications
  * `@fastly/auth/session.ensureSession()` errors/catches in non-ember applications

You may override this value in a few ways:

  * ember applications can specify a `FASTLY_AUTH_PATH` environment variable
  * ember applications can set `config['fastly-auth'].authPath`
  * any application can pass an `authPath` when creating an instance of `@fastly/auth/session`

### Client Name

In a non-ember application, you can pass `{ client: 'MyClient v1.2.3' }` when constructing a `@fastly/auth/session`.

In an ember application, @fastly/auth will use `APP.name` and `APP.version` from `config/environment`. You can override the `client` by speficying `config['fastly-auth'].client`.

## Additional Ember App Features

### Sudo Authentication / Permissions Elevation

The included Ember Addon in this package ships some additional classes your app can use to add a permissions elevation workflow (putting the user's token in to `sudo` mode). These classes are:

  * `component:fui-sudo-field`
  * `route:elevate-permissions`
  * `route:requires-sudo-route`

To add the workflow to your application:

  1. In your app's `router.js`, add:
      ```js
      this.route('elevate-permissions)
      ```
  1. For any route that you want to require sudo mode to view, do the following:
      ```js
      /// in app/routes/my-very-important-route.js
      import RequiresSudoRoute from '@fastly/auth/routes/requires-sudo-route'

      export default RequiresSudoRoute.extend({
        /// extend as normal
      })
      ```
  1. The `elevate-permissions` route is set up to only allow incoming navigation from a route extending `RequiresSudoRoute`. If this route is loaded via any other method it will throw a `NotFoundError` as defined by `ember-ajax`. The recommended way to handle this is by setting up Ember's error event on the `application` route to catch this error. The following is a basic example: 
      ```js
      import { NotFoundError } from 'ember-ajax/errors'
      import Route from '@ember/routing/route'

      /**
       * Route: Application
      **/
      export default Route.extend({
        [...]
        actions: {
          error(err, transition) {
            if (err instanceof NotFoundError) {
              this.intermediateTransitionTo('not-found', err)
              return
            }

            transition.abort()

            this.intermediateTransitionTo('error', err)
          },
        }
      })
      ```
  For more details please see, [Ember Docs > The `error` event](https://guides.emberjs.com/release/routing/loading-and-error-substates/#toc_the-error-event)

Your route will now check to ensure the user's token is in `sudo` mode before allowing them to proceed; if it is not, they will be redirected to the intermediate `route:elevate-permissions` where they will see a screen prompting them to either enter their password or re-auth via their SAML IDP, depending on how their session was initiated. Once they have elevated their token permissions, they will be sent along their way to their original destination.

For an example of how this works, start this addon's dummy application with `ember s` and visit `http://localhost:4200`, and/or view the dummy app's code. When using the dummy app example, any password will "work" to send you through to the protected route. An example of an error state can be see by entering `bad-password` as the value in the password field.

#### How it works

The `route:requires-sudo` and `route:elevate-permissions` classes work together to control user flow through the process, and the template for `route:elevate-permissions` contains an instance of `component:fui-sudo-field` which is prewired with the code to redirect the user to their intended destination on successful sudo auth (via password).

The workflow is as follows:

  1. User attempts to view a protected route (an instance of `route:requires-sudo`)
  1. The protected route determines whether the user's token is in sudo mode or not; if not, it saves its own URL into `localStorage` before the route transition completes and redirects the user to `route:elevate-permissions`
  1. The user reauthenticates:
      * **Via password:** when successful, `component:fui-sudo-field` uses the passed-in `onSudo` method to trigger behavior from `route:elevate-permissions` which retries the previous transition, which is saved to `controller:elevate-permissions` before the redirect to `route:elevate-permissions`.
      * **Via SAML:** a request is made to Northstar to get the user's IDP reauthentication URL, and the location of the protected route is appended to this via query param. When the user successfully reauths with their IDP, they are redirected back to a special route in Norhtstar which confirms the reauth operation and elevates the token status, and then redirects the user to the originally intended URL in the application.

#### Using `component:fui-sudo-field`

Consuming applications can optionally use `component:fui-sudo-field` on its own if they choose, and allow users to elevate permissions without redirecting to another route. While this is not reccomended, it is a feature provided to help ease migrating to this new workflow for apps that already have sudo reauth implemented inline.

The component accepts a single property, `onSudo`, which expects a method or closure action dictating some arbitrary behavior to execute when the sudo operation completes. Note that this behavior _only_ applies to users authenticating via password, as authentication via SAML will force a redirect away from the app regardless.

### Supporting customer-switching
The included Ember Addon in this package ships some additional classes your app can use to add a customer-switching flow. These classes are:

  * `route:switch-customer`
  * `route:switch-customer/two-factor-auth`

To add this workflow to your application:
1. In your app's `router.js`, add:
      ```js
        this.route('switch-customer', function() {
        this.route('two-factor-auth')
        this.route('choose-account')
      })
      ```
    Or, to include the above _and_ the elevate-permissions route, add:
      ```js
        import authRequiredRoutes from '@fastly/auth/utils/fastly-auth-required-routes'
        [...]

        Router.map(function() {  
          authRequiredRoutes.apply(this)
        [...]
      ```
2. Tell the session service where users should land after they switch to a new customer:
    ```js
      // services:session
      import Session from '@fastly/auth/services/session'

      export default Session.extend({
        customerSwitchReturnTo: computed(function() {
          return this.router.urlFor('customer.landing')
        }),
      })
    ```
3. If your application is wrapped in a `fui-chrome`, that's all you need to do; a user with multiple accounts will see a link to switch in their account menu, and the link will work.

4. To build a custom customer-switching experience in your application, extend the `customer-switch` route:
    ```js
      // app/routes/my-custom-switching-route.js
      import CustomerSwitchingEnabledRoute from '@fastly/auth/routes/customer-switch'

      export default CustomerSwitchingEnabledRoute.extend({
        [...]
      })

      // app/component/switch-customer-button.js
      export default Component.extend({
        session: service(),

        switchCustomerAccount(customerId) {
          this.session.switchAccount(customerId)
        }
        [...]
      })
    ```

## Testing

### In Ember Applications

Ember defines `config:environment` via an initializer. Initializers run in acceptance tests, but not integration- or unit tests.

**Acceptance tests**: use [ember-cli-mirage](http://www.ember-cli-mirage.com/) or another library to stub out HTTP requests. Everything else should work properly.

**Integration tests**: like acceptance tests, but you'll also have to inject `config:environment` into your container so `service:ajax` and `service:session` can look up the API domain.

**Unit tests**: stub out collaborators entirely; don't use real or mock HTTP requests at all.

## Dependencies

* jQuery.ajax. You can use this library without jQuery if you pass an `ajaxTransport` function when creating an instance of `@fastly/auth/session`. This will let you rely on `XMLHttpRequest`, `fetch`, or another library.
* [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL)
* [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
* ES6, including `const`, classes, and destructuring

## Known Implementations

* [fastly-waf-ui](https://github.com/fastly/fastly-waf-ui)
* [keyhandler-ui](https://github.com/fastly/keyhandler-ui)
* [beta-docs](https://github.com/fastly/beta-docs)
* [admin-ui](https://github.com/fastly/admin-ui)
* [snowcat-ui](https://github.com/fastly/snowcat)

# Metadata

- Team: IAM (AppEng)
- Slack: #app-eng-iam
- Engineer: Steve Heydweiller
- Engineer: Jeneve Parrish
- Related: [Umbrella Auth](https://github.com/fastly/umbrella-auth)
- JIRA: [IAM Team Board](https://jira.corp.fastly.com/secure/RapidBoard.jspa?rapidView=555)
