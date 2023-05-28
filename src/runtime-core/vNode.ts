export const createVNode = (type,props?,children?) => {

  const vNode = {
    type,
    props,
    children,
    el: null
  }
  
  return vNode
};
