import { h } from "../../lib/guide-min-vue.es.js";

export default {
  setup(props){
    console.log(props);
    // readonly
    props.count++
    console.log(props);
  },
  render(){
    return h("div",{},`foo: ${this.count}`)
  }
}