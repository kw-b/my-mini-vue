import { h } from '../../lib/guide-min-vue.es.js';
import { Foo } from './Foo.js';

export const App = {
  name: 'App',
  render(){
    return h("div",{},[h("div",{},"App"),h(Foo,{
      onAdd(...args){
        console.log("onAdd",...args);
      },
      onAddFoo(){
        console.log("onAddFoo");
      }
    })])
  },
  setup(){
    return {}
  }
};
