// name of polymorphic multi method
// we can extend a multi method at runtime for a given shape of data
// TODO: show difference to a class
// TODO: show the benefits over a standard object

const DEFAULT = Symbol('DEFAULT_DEFMULTI');

function defmulti(dispatchFn, ...methods) {
  const dispatchTable = new Map();

  const addMethod = (maybeConfig, maybeMethod) => {
    let o, f;

    if (typeof maybeMethod === 'undefined') {
      [o, f] = maybeConfig
    } else {
      o = maybeConfig;
      f = maybeMethod;
    }

    dispatchTable.set(o, f)
  }

  methods.forEach((m) => addMethod(m))

  const matchingMethods = () => {
    return [...dispatchTable.keys()];
  }

  const facade = (o) => {
    const method = dispatchTable.get(dispatchFn(o))

    if (method) {
      return method(o)
    }

    if (dispatchTable.get(DEFAULT)) {
      return dispatchTable.get(DEFAULT)(o)
    }

    throw new Error(`No matching method found for ${JSON.stringify(o)}, and no DEFAULT value specified`);
  };

  facade.methods = matchingMethods;
  facade.addMethod = addMethod;

  return facade;
}

export {
  DEFAULT,
  defmulti
}
