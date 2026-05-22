function getBasicIdentifier(node) {
  if (node.type === 'Identifier') {
    // classes.foo
    return node.name;
  }

  if (node.type === 'Literal') {
    // classes['foo']
    return node.value;
  }

  if (node.type === 'TemplateLiteral') {
    // classes[`foo`]
    if (node.expressions.length) {
      // classes[`foo${bar}`]
      return null;
    }
    return node.quasis[0].value.raw;
  }

  // Might end up here with things like:
  // classes['foo' + bar]
  return null;
}

module.exports = {
  meta: {
    type: 'problem',
  },
  create: function rule(context) {
    const usedClasses = {};
    const definedClasses = {};
    const { options = [] } = context;
    const allowRenamedClasses = options
      .map((option) => option?.allowRenamedClasses === true)
      .some((value) => value === true);

    return {
      CallExpression(node) {

        const isMakeStyles = node.callee.name === 'makeStyles';

        const isModernApi = (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.name === 'create' &&
          getBaseIdentifier(node.callee.object)?.name === "tss"
        );

        if (!isMakeStyles && !isModernApi) {
          return;
        }

        const stylesObj = (() => {

          const styles = (() => {

            if (isMakeStyles) {
              return node.parent.arguments[0];
            }

            if (isModernApi) {
              return node.callee.parent.arguments[0];
            }

            throw new Error("never");

          })();

          if (!styles) {
            return undefined;
          }

          switch (styles.type) {
            case "ObjectExpression":
              return styles;
            case "ArrowFunctionExpression": {

              const { body } = styles;

              switch (body.type) {
                case 'ObjectExpression': return body;
                case 'BlockStatement': {

                  let stylesObj = undefined;

                  body.body.forEach(bodyNode => {
                    if (
                      bodyNode.type === 'ReturnStatement' &&
                      bodyNode.argument.type === 'ObjectExpression'
                    ) {
                      stylesObj = bodyNode.argument;
                    }
                  });

                  return stylesObj;

                }

              }

            } break;
          }

          return undefined;

        })();

        if (stylesObj === undefined) {
          return;
        }

        stylesObj.properties.forEach((property) => {
          if (property.computed) {
            // Skip over computed properties for now.
            // e.g. `{ [foo]: { ... } }`
            return;
          }

          if (
            property.type === 'ExperimentalSpreadProperty' ||
            property.type === 'SpreadElement'
          ) {
            // Skip over object spread for now.
            // e.g. `{ ...foo }`
            return;
          }
          definedClasses[property.key.value || property.key.name] = property;
        });


      },

      MemberExpression(node) {
        if (node.object.type === 'Identifier' && (node.object.name === 'classes' || (allowRenamedClasses && node.object.name))) {
          const whichClass = getBasicIdentifier(node.property);
          if (whichClass) {
            usedClasses[whichClass] = true;
          }
          return;
        }

        const classIdentifier = getBasicIdentifier(node.property);
        if (!classIdentifier) {
          // props['foo' + bar].baz
          return;
        }

        if (classIdentifier !== 'classes') {
          // props.foo.bar
          return;
        }

        const { parent } = node;

        if (parent.type !== 'MemberExpression') {
          // foo.styles
          return;
        }

        if (node.object.object && node.object.object.type !== 'ThisExpression') {
          // foo.foo.styles
          return;
        }

        const propsIdentifier = getBasicIdentifier(parent.object);
        if (propsIdentifier && propsIdentifier !== 'props') {
          return;
        }
        if (!propsIdentifier && parent.object.type !== 'MemberExpression') {
          return;
        }

        if (parent.parent.type === 'MemberExpression') {
          // this.props.props.styles
          return;
        }

        const parentClassIdentifier = getBasicIdentifier(parent.property);
        if (parentClassIdentifier) {
          usedClasses[parentClassIdentifier] = true;
        }
      },
      'Program:exit': () => {
        // Now we know all of the defined classes and used classes, so we can
        // see if there are any defined classes that are not used.
        Object.keys(definedClasses).forEach((definedClassKey) => {
          if (!usedClasses[definedClassKey]) {
            context.report(
              definedClasses[definedClassKey],
              `Class \`${definedClassKey}\` is unused`,
            );
          }
        });
      },
    };
  },
}


// Helper function to recursively get the base identifier from a MemberExpression node
function getBaseIdentifier(node) {
  if (node.type === 'Identifier') {
    return node;
  } else if (node.type === 'CallExpression') {
    return getBaseIdentifier(node.callee);
  } else if (node.type === 'MemberExpression') {
    return getBaseIdentifier(node.object);
  } else {
    return null;
  }
}