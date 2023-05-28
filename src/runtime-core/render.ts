import { createComponentInstance, setupComponent } from "./component"

export const render = (vNode, container) => {
  // 调用 patch 递归处理
  patch(vNode, container)
}

function patch(vNode, container) {
  // 去处理组件
  // [x] 判断 vNode 是不是一个 element
  if (typeof vNode.type === "string") {
    processElement(vNode, container)
  } else if (typeof vNode.type === "object") {
    processComponent(vNode, container)
  }
}

function processElement(vNode, container) {
  // init -> update
  mountElement(vNode, container)
}

function mountElement(vNode: any, container: any) {
  const el = (vNode.el = document.createElement(vNode.type))
  // string array
  const { children } = vNode
  if (typeof children === "string") {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(vNode, el)
  }

  const { props } = vNode
  for (const key in props) {
    const val = props[key]
    el.setAttribute(key, val)
  }

  container.append(el)
}

function mountChildren(vNode: any, container: any) {
  vNode.children.forEach((v) => {
    patch(v, container)
  })
}

function processComponent(vNode, container) {
  mountComponent(vNode, container)
}

function mountComponent(initialVNode, container) {
  const instance = createComponentInstance(initialVNode)
  setupComponent(instance)
  setupRenderEffect(instance,initialVNode, container)
}
function setupRenderEffect(instance,initialVNode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)
  // vNode -> patch
  // vNode -> element -> mountElement
  patch(subTree, container)

  // element -> mount
  initialVNode.el = subTree.el
}
