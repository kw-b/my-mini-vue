import { render } from "./render"
import { createVNode } from "./vNode"

export const createApp = (rootComponent) => {
  return {
    mount(rootContainer) {
      // 先转换为虚拟节点(vNode)
      // component -> vNode
      // 所有的操作逻辑 都会基于 vNode 做处理
      const vNode = createVNode(rootComponent)

      render(vNode, rootContainer)
    },
  }
}
