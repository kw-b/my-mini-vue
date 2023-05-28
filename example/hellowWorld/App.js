import { h } from "../../lib/guide-min-vue.es.js"
window.self = null
export const App = {
  render() {
    window.self = this
    return h(
      "div",
      {
        id: "root",
        class: ["red ", "hard"],
        onClick(){
          console.log("click");
        },
        onMousedown(){
          console.log("mousedown");
        }
      },
      // string
      `hi, ${this.msg}`
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
