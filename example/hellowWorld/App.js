import { h } from "../../lib/guide-min-vue.es.js"
export const App = {
  render() {
    return h(
      "div",
      {
        id: "root",
        class: ["red ", "hard"],
      },
      `hi, ${this.msg}`
    )
  },

  setup() {
    return {
      msg: "mini-vue",
    }
  },
}
