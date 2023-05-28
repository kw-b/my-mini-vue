import { createComponentInstance, setupComponent } from "./component"

export const render = (vNode, container) => {
  // 调用 patch 递归处理
  patch(vNode,container)
}

function patch(vNode,container) {
  // 去处理组件
  // [x] 判断 vNode 是不是一个 element
  if(typeof vNode.type === 'string'){
    processElement(vNode,container)
  }else if(typeof vNode.type === 'object'){
    processComponent(vNode,container)
  }
}

function processElement(vNode,container) {
  // init -> update
  mountElement(vNode,container)
}


function mountElement(vNode: any, container: any) {
  const el = document.createElement(vNode.type)
  // string array
  const {children} = vNode
  
  el.textContent = children
}

function processComponent(vNode,container) {
  mountComponent(vNode,container)
}

function mountComponent(vNode,container) {
  const instance = createComponentInstance(vNode)
  setupComponent(instance)
  setupRenderEffect(instance,container)
}
function setupRenderEffect(instance,container) {
  const subTree = instance.render()
  // vNode -> patch
  // vNode -> element -> mountElement
  patch(subTree,container)
}

