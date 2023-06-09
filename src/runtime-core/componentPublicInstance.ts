import { hasOwn } from "../shared"

const publicPropertiesMap = {
  $el:(i) => i.vNode.el
}


export const PublicInstanceProxyHandlers = {
  get({_:instance},key){
    const {setupState,props} = instance
    // if(key in setupState){
    //   return setupState[key]
    // }
    if(hasOwn(setupState,key)){
      return setupState[key]
    }else if(hasOwn(props,key)){
      return props[key]
    }

    // key -> $el
    const publicGetter = publicPropertiesMap[key]
    if(publicGetter){
      return publicGetter(instance)
    }
  },
}
