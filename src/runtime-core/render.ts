import { createComponentInstance, setupComponent } from "./component"

export const render = (vNode, container) => {
  // 调用 patch 递归处理
  patch(vNode,container)
}

function patch(vNode,container) {
  // 去处理组件
  processComponent(vNode,container)
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

