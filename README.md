# Detect unused tss-react classes

This eslint plugin lets you detect unused [tss-react](https://tss-react.dev) classes:

https://user-images.githubusercontent.com/6702424/167231369-4eaeb5b2-bb39-4647-9911-086572c5e212.mov


# Usage

1. Add the dependency:
```sh
yarn add --dev eslint-plugin-tss-unused-classes
```

2. Enable it in you ESLint config

**Case 1**: You are in a [`create-react-app`](https://create-react-app.dev/) project:  
Edit your `package.json`:  

```jsonc
{
  //...
  "eslintConfig": {
    "plugins": [
      //...
      "tss-unused-classes"
    ],
    "rules": {
      "tss-unused-classes/unused-classes": "warn"
    }
  },
  //...
}
```
[Example projet](https://github.com/InseeFrLab/onyxia-web)

**Case 2**: You have installed ESLint manually:  
Edit your `.eslintrc.js` file:  
```js
module.exports = {
  // ...
  plugins: [
    // ...
    'tss-unused-classes'
  ],
  rules: {
    // ...
    'tss-unused-classes/unused-classes': 'warn'
  }
}
```
[Example project](https://github.com/InseeFrLab/onyxia-ui)


## Disabling warnings

In case of false positive, disabling the warning:  

- For a line: `// eslint-disable-next-line tss-unused-classes/unused-classes`
- For the entire file: `// eslint-disable-next-line tss-unused-classes/unused-classes`

## Options

By default the linter does not test against renamed classes, eg: 

```js
const { classes: myClasses } = useStyles();
```

If you want to enable this then use the `allowRenamedClasses` option in the `.eslintrc.js` file:

```js
module.exports = {
  // ...
  rules: {
    // ...
    'tss-unused-classes/unused-classes': ['warn', allowRenamedClasses: true]
  }
}
```