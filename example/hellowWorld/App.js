import { h } from "../../lib/guide-min-vue.es.js"
import Foo from './foo.js';
window.self = null
export const App = {
  name: 'App',
  render() {
    window.self = this
    return h(
      "div",
      {
        id: "root",
        onClick() {
          console.log("click")
        },
        onMousedown() {
          console.log("mousedown")
        },
      },
      [h("div", {}, `hi,${this.msg}`), h(Foo, { count: 1 })]
      // string
      // `hi, ${this.msg}`
      // Array
      // [h("p",{class:"red"},"hi"),h("p",{class:"blue"},"HI")]
      // this.$el -> get root element
    )
  },

  setup() {
    return {
      msg: "mini-vue",
    }
  },
}
