export const createComponentInstance = (vNode) => {
  const component = {
    vNode,
    type: vNode.type,
  }
  return component
}

export const setupComponent = (instance) => {
  //[ ] initProp()
  //[ ] initSlots()

  setupStateFulComponent(instance)
}

function setupStateFulComponent(instance) {
  const component = instance.type
  const { setup } = component
  if (setup) {
    // function object
    const setupResult = setup()
    handleSetupResult(instance, setupResult)
  } else {
  }
}

function handleSetupResult(instance, setupResult) {
  if (typeof setupResult === "object") {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const component = instance.type
  instance.render = component.render
}