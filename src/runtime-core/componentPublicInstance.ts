const publicPropertiesMap = {
  $el:(i) => i.vNode.el
}


export const PublicInstanceProxyHandlers = {
  get({_:instance},key){
    const {setupState} = instance
    if(key in setupState){
      return setupState[key]
    }

    // key -> $el
    const publicGetter = publicPropertiesMap[key]
    if(publicGetter){
      return publicGetter(instance)
    }
  },
}