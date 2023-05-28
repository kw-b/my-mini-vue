import { h } from "../../lib/guide-min-vue.es.js"
export const App = {
  render() {
    return h(
      "div",
      {
        id: "root",
        class: ["red ", "hard"],
      },
      // string
      // `hi, ${this.msg}`
      // Array
      [h("p",{class:"red"},"hi"),h("p",{class:"blue"},"HI")]
    )
  },

  setup() {
    return {
      msg: "mini-vue",
    }
  },
}
