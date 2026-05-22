
const eslint = require('eslint');
const rule = require('./rule');

const ruleTester = new eslint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
});
ruleTester.run('warn-unused-classes', rule, {
  valid: [
    `const useStyles = makeStyles()(() => ({
      testClass: {
        backgroundColor: 'red'
      }
    }))
    const Component = () => {
      const { classes } = useStyles()
      return <div className={classes.testClass}>test</div>
    }`,
    `const useStyles = makeStyles()({
      testClass: {
        "backgroundColor": 'red'
      }
    })
    const Component = () => {
      const { classes } = useStyles()
      return <div className={classes.testClass}>test</div>
    }`,
    `const useStyles = tss.create(() => ({
      testClass: {
        backgroundColor: 'red'
      }
    }))
    const Component = () => {
      const { classes } = useStyles()
      return <div className={classes.testClass}>test</div>
    }`,
    `const useStyles = tss.create({
      testClass: {
        "backgroundColor": 'red'
      }
    })
    const Component = () => {
      const { classes } = useStyles()
      return <div className={classes.testClass}>test</div>
    }`,
    {
      code: `const useStyles = tss.create({
        testClass: {
          "backgroundColor": 'red'
        }
      })
      const Component = () => {
        const { classes: renamedClasses } = useStyles()
        return <div className={renamedClasses.testClass}>test</div>
      }`,
      options: [{ allowRenamedClasses: true }]
    },
    {
      code: `const useStylesOne = tss.create({
        header: {
          "backgroundColor": 'red'
        }
      })
      const useStylesTwo = tss.create({
        footer: {
          "backgroundColor": 'blue'
        }
      })
      const Component = () => {
        const { classes: renamedClassesOne } = useStylesOne();
        const { classes: renamedClassesTwo } = useStylesTwo()
        return <>
          <div className={renamedClassesOne.header}>test</div>
          <div className={renamedClassesTwo.footer}>test</div>
        </>
      }`,
      options: [{ allowRenamedClasses: true }]
    }
  ],
  invalid: [
    {
      code: `const useStyles = makeStyles()(() => ({
        testClass: {
          backgroundColor: 'red'
        }
      }))
      const Component = () => {
        const { classes } = useStyles()
        return <div>test</div>
      }`,
      errors: [{
        message: 'Class `testClass` is unused'
      }]
    },
    {
      code: `const useStyles = makeStyles()({
        testClass: {
          backgroundColor: 'red'
        }
      })
      const Component = () => {
        const { classes } = useStyles()
        return <div>test</div>
      }`,
      errors: [{
        message: 'Class `testClass` is unused'
      }]
    },


    {
      code: `const useStyles = tss.create(() => ({
        testClass: {
          backgroundColor: 'red'
        }
      }))
      const Component = () => {
        const { classes } = useStyles()
        return <div>test</div>
      }`,
      errors: [{
        message: 'Class `testClass` is unused'
      }]
    },
    {
      code: `const useStyles = tss.create({
        testClass: {
          backgroundColor: 'red'
        }
      })
      const Component = () => {
        const { classes } = useStyles()
        return <div>test</div>
      }`,
      errors: [{
        message: 'Class `testClass` is unused'
      }]
    },
    {
      code: `const useStyles = tss.withName("Component").create({
        testClass: {
          backgroundColor: 'red'
        }
      })
      const Component = () => {
        const { classes } = useStyles()
        return <div>test</div>
      }`,
      errors: [{
        message: 'Class `testClass` is unused'
      }]
    },
    {
      code: `const useStyles = tss.create({
        testClass: {
          "backgroundColor": 'red'
        }
      })
      const Component = () => {
        const { classes: renamedClasses } = useStyles()
        return <div className={renamedClasses.testClass}>test</div>
      }`,
      errors: [{
        message: 'Class `testClass` is unused'
      }]
    },
    {
      code: `const useStylesOne = tss.create({
        header: {
          "backgroundColor": 'red'
        }
      })
      const useStylesTwo = tss.create({
        footer: {
          "backgroundColor": 'blue'
        }
      })
      const Component = () => {
        const { classes: renamedClassesOne } = useStylesOne();
        const { classes: renamedClassesTwo } = useStylesTwo()
        return <>
          <div className={renamedClassesOne.header}>test</div>
          <div>test</div>
        </>
      }`,
      options: [{ allowRenamedClasses: true }],
      errors: [{
        message: 'Class `footer` is unused'
      }]
    },

  ],
});