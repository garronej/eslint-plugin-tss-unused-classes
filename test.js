
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
    `const useStyles = makeStyles()(() => ({
      testClass: {
        backgroundColor: 'red'
      }
    }))
    const Component = () => {
      const { classes: renamedClasses } = useStyles()
      return <div className={renamedClasses.testClass}>test</div>
    }`,
    `const useStylesOne = makeStyles()(() => ({
      header: {
        backgroundColor: 'red'
      }
    }))
    const useStylesTwo = makeStyles()(() => ({
      footer: {
        backgroundColor: 'blue'
      }
    }))
    const Component = () => {
      const { classes: classesOne } = useStylesOne();
      const { classes: classesTwo } = useStylesOne();
      return <>
        <div className={classesOne.header}>test</div>
        <div className={classesTwo.footer}>test</div>
      </>
    }`,
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
      code: `const useStyles = tss.withName('Component').create({
        testClass: {
          backgroundColor: 'red'
        }
      })
      const Component = () => {
        const { classes: renamedClasses } = useStyles()
        return <div>test</div>
      }`,
      errors: [
        {
          message: 'Class `testClass` is unused',
        },
      ],
    },
    {
      code: `const useStylesOne = tss.withName('Component').create({
        header: {
          backgroundColor: 'red'
        }
      })
      const useStylesTwo = tss.withName('Component').create({
        footer: {
          backgroundColor: 'blue'
        }
      })
      const Component = () => {
        const { classes: classesOne } = useStylesOne()
        const { classes: classesTwo } = useStylesTwo()
        return <>
          <div className={classesOne.header}>test</div>
          <div>test</div>
        </>
      }`,
      errors: [
        {
          message: 'Class `footer` is unused',
        },
      ],
    },
  ],
});