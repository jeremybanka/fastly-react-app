### Phasing out Ember Can in preparation for Enhanced RBAC

As part of the Enhanced RBAC (eRBAC) project we will be removing Ember Can from our UI applications in favor of new resources included in this library. Ember Can has served us well over the years but the new permission structure introduced in eRBAC, and the ways we interact with them, did not neatly fit the mold provided by Ember Can so we decided to move away from it. The first phase of this phase out is to remove direct calls to Ember Can's service or helpers and instead pass through the new Permissions service and permitted/not-permitted helpers to Ember Can. This allows us to quickly remove the Ember Can code from our code base (save for the ability definitions) and sets us up to replace the use of the abilities with new permissions provided in eRBAC.

#### Ember Can to Permissions changes
To utilize the Permissions service in place of the Can service, you will pass the properties you would have passed to the can method in an options hash that looks like this:
```
{
  legacyAbility: [ability name without "can"],
  legacyModel: [what would've been the second parameter to the can method],
  [...]: [any additional properties needed (use with caution as this will change with eRBAC)]
}
```

**NOTE**: The Permissions service comes with a `notPermitted` method. Please use this method instead of `!this.permissions.permitted()`. This is not shown in the examples below.

###### Before - Ember Can Service Usage - Simple
```js
export default Route.extend({
  can: service(),

  beforeModel(transition) {
    if (!this.get('can').can('view tls')) {
      [...]
    }
  },
})
```

###### After - Permissions Service Usage - Simple
```js
export default Route.extend({
  permissions: service(),

  beforeModel(transition) {
    if (
      !this.permissions.permitted({
        legacyAbility: 'view tls'
      })
    ) {
      [...]
    }
  },
})
```

###### Before - Ember Can Service Usage - With Model
```js
export default Component.extend({
  can: service(),

  canEditService: computed('service', function() {
    return this.can.can('edit service', this.service)
  }),
})
```

###### After - Permissions Service Usage - With Model
```js
export default Component.extend({
  permissions: service(),

  canEditService: computed('service', function() {
    return this.permissions.permitted({
      legacyAbility: 'edit service',
      legacyModel: this.service
    })
  }),
})
```

###### Before - Ember Can Service Usage - With Model and Additional Properties
```js
export default Component.extend({
  can: service(),

  canEditService: computed('service', function() {
    return this.can.can('edit service', this.service, { anotherProp: 'yay' })
  }),
})
```

###### After - Permissions Service Usage - With Model and Additional Properties
```js
export default Component.extend({
  permissions: service(),

  canEditService: computed('service', function() {
    return this.permissions.permitted({
      legacyAbility: 'edit service',
      legacyModel: this.service,
      anotherProp: 'yay',
    })
  }),
})
```

#### Ember Can helpers to Permission helpers
To change out the usage of Ember Can helpers to Permissions helpers you will pass a `legacy-ability` property to the `permitted` helper. You can also pass a `legacy-model` property to represent Ember Can's model. Any additional properties passed to the helper will be passed through to Ember Can as is.

**NOTE**: A `not-permitted` helper is available. Please use this helper instead of calling `{{if (not (permitted legacy-ability=...))}}`. This is not shown in the examples below.

###### Before - Ember Can Helper - Simple
```hbs
{{#if (can 'view tls')}}
  [...]
{{/if}}
```

###### After - Permissions Helper - Simple
```hbs
{{#if (permitted legacy-ability='view tls')}}
  [...]
{{/if}}
```

###### Before - Ember Can Helper - With Model
```hbs
{{#if (can 'edit service' this.service)}}
  [...]
{{/if}}
```

###### After - Permissions Helper - With Model
```hbs
{{#if (permitted legacy-ability='edit service' legacy-model=this.service)}}
  [...]
{{/if}}
```

###### Before - Ember Can Helper - With Model and Addition Parameters
```hbs
{{#if (can 'edit service' this.service anotherProp='yay')}}
  [...]
{{/if}}
```

###### After - Permissions Helper - With Model and Addition Parameters
```hbs
{{#if (permitted legacy-ability='edit service' legacy-model=this.service anotherProp='yay')}}
  [...]
{{/if}
```

## As we continue work on eRBAC this document will update with further details around making the change to use the new permission structure.