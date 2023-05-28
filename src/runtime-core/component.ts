import { initProps } from "./componentProps"
import { PublicInstanceProxyHandlers } from "./componentPublicInstance"
import { shallowReadonly } from '../reactivity/reactive';

export const createComponentInstance = (vNode) => {
  const component = {
    vNode,
    type: vNode.type,
    setupState:{},
    props:{}
  }
  return component
}

export const setupComponent = (instance) => {
  // [x]
   initProps(instance, instance.vNode.props)
  //[ ] initSlots()

  setupStateFulComponent(instance)
}

function setupStateFulComponent(instance) {
  const component = instance.type
  const { setup } = component
  instance.proxy = new Proxy({_:instance},PublicInstanceProxyHandlers)
  if (setup) {
    // function object
    const setupResult = setup(shallowReadonly(instance.props) )
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
