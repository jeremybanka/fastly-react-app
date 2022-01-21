var baseConfig = {
  extends: [
    `eslint:recommended`,
    `prettier`,
    `plugin:@typescript-eslint/recommended`,
    `plugin:import/recommended`,
  ],
  plugins: [`prettier`, `import`, `jest`, `@typescript-eslint`, `react-hooks`],
  parser: `@typescript-eslint/parser`,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: `module`,
  },
  env: {
    node: true,
    browser: true,
    es2021: true,
    jest: true,
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [`.ts`, `.tsx`],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true, // try to resolve types `<root>@types` directory
        project: `./tsconfig.json`,
      },
    },
  },
  /*
  settings: {
    "import/resolver": {
      node: {
        extensions: [`.js, .cjs, .ts, .tsx`],
      },
    },
  },
  */
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: [`*.ts`, `*.tsx`],
      rules: {
        "no-extra-semi": `off`,
        "@typescript-eslint/no-extra-semi": 0,
        "@typescript-eslint/explicit-member-accessibility": [`error`],
        "@typescript-eslint/ban-ts-comment": `off`,
        "@typescript-eslint/prefer-enum-initializers": `error`,
        "@typescript-eslint/prefer-literal-enum-member": `error`,
        "@typescript-eslint/prefer-optional-chain": `error`,
        "@typescript-eslint/sort-type-union-intersection-members": `error`,
        "@typescript-eslint/type-annotation-spacing": `error`,
        "@typescript-eslint/unified-signatures": `error`,
        "@typescript-eslint/no-unused-vars": `off`,
        "@typescript-eslint/no-explicit-any": `off`,
        "@typescript-eslint/explicit-module-boundary-types": `error`,
        "@typescript-eslint/consistent-type-imports": [
          `error`,
          {
            prefer: `type-imports`,
          },
        ],
      },
    },
  ],
  rules: {
    "react-hooks/rules-of-hooks": `error`, // Checks rules of Hooks
    "react-hooks/exhaustive-deps": `warn`, // Checks effect dependencies

    "import/extensions": [
      `error`,
      {
        ts: `never`,
        tsx: `never`,
        js: `never`,
        jsx: `never`,
        css: `always`,
        scss: `always`,
        client: `always`,
        server: `always`,
      },
    ],
    "import/named": 0,
    "import/no-unresolved": `error`,
    "import/prefer-default-export": `off`,
    "prettier/prettier": `error`,
    "arrow-parens": [`error`, `always`],
    "comma-dangle": [
      `error`,
      {
        arrays: `always-multiline`,
        objects: `always-multiline`,
        imports: `always-multiline`,
        exports: `always-multiline`,
        functions: `only-multiline`,
      },
    ],
    "consistent-return": `off`,
    curly: [`error`, `multi-line`, `consistent`],
    "function-paren-newline": `off`,
    "implicit-arrow-linebreak": `off`,
    "jsx-quotes": [`error`, `prefer-double`],
    "keyword-spacing": [
      `error`,
      {
        overrides: {
          if: { after: true },
          while: { after: true },
          for: { after: true },
          switch: { after: true },
          catch: { after: true },
        },
      },
    ],
    "max-classes-per-file": `off`,
    "max-len": [
      `error`,
      {
        code: 110,
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true,
        ignorePattern: `^import\\s.+\\sfrom\\s.+$`,
        ignoreUrls: true,
      },
    ],
    "max-lines": [
      `error`,
      {
        max: 270,
        skipBlankLines: false,
        skipComments: false,
      },
    ],
    "no-confusing-arrow": `off`,
    "no-console": `off`,
    "no-continue": `off`,
    "no-else-return": [
      `error`,
      {
        allowElseIf: true,
      },
    ],
    "no-mixed-operators": `off`,
    "no-multi-spaces": [
      `error`,
      {
        ignoreEOLComments: true,
        exceptions: {
          Property: true,
          VariableDeclarator: true,
          ImportDeclaration: true,
        },
      },
    ],
    "no-nested-ternary": `off`,
    "no-param-reassign": `off`,
    "no-plusplus": `off`,
    "no-restricted-syntax": [`error`, `LabeledStatement`, `WithStatement`],
    "no-return-assign": `off`,
    "no-shadow": `off`,
    "no-undef-init": `off`,
    "no-underscore-dangle": `off`,
    "no-unused-expressions": [
      `error`,
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
    "no-use-before-define": `off`,
    "nonblock-statement-body-position": `off`,
    "object-curly-newline": [
      `error`,
      {
        consistent: true,
      },
    ],
    "operator-linebreak": [`error`, `after`, { overrides: { "?": `before`, ":": `before` } }],
    "prefer-destructuring": [
      `error`,
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    quotes: [`error`, `backtick`],
    // 'quote-props': [`error`, `consistent`, { unnecessary: false }],
    semi: [`error`, `never`],
    "react/prop-types": `off`,
    "react/require-default-props": `off`,
    "react/react-in-jsx-scope": `off`,
    /*
    "import/order": [
      `error`,
      {
        groups: [`builtin`, `external`, `internal`],
        pathGroups: [
          {
            pattern: `react`,
            group: `external`,
            position: `before`,
          },
          {
            pattern: `remix`,
            group: `external`,
            position: `before`,
          },
          {
            pattern: `~`,
            group: `internal`,
            position: `before`,
          },
          {
            pattern: `~/**`,
            group: `internal`,
            position: `before`,
          },
        ],
        pathGroupsExcludedImportTypes: [`react`, `remix`],
        "newlines-between": `always`,
        alphabetize: {
          order: `asc`,
          caseInsensitive: true,
        },
      },
    ],
    */
  },
}

/* eslint-disable no-undef */
module.exports = {
  extends: [...baseConfig.extends, `plugin:react/recommended`],
  plugins: [...baseConfig.plugins, `react`],
  parser: baseConfig.parser,
  parserOptions: Object.assign(baseConfig.parserOptions, {
    ecmaFeatures: { jsx: true },
  }),
  env: baseConfig.env,
  rules: baseConfig.rules,
  settings: Object.assign(baseConfig.settings, {
    react: {
      version: `detect`,
    },
  }),
}
