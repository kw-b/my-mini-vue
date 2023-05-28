import { isObject } from "../shared"
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers"

export const enum ReactiveFlag {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v-isReadonly",
}

export const reactive = (raw) => createActiveObject(raw, mutableHandlers)

export const readonly = (raw) => createActiveObject(raw, readonlyHandlers)

export const shallowReadonly = (raw) =>
  createActiveObject(raw, shallowReadonlyHandlers)

export const isReactive = (value) => !!value[ReactiveFlag.IS_REACTIVE]

export const isReadonly = (value) => !!value[ReactiveFlag.IS_READONLY]

export const isProxy = (value) => isReactive(value) || isReadonly(value)

function createActiveObject(raw, baseHandlers) {
  if(!isObject(raw)){
    console.warn(`target${ raw }必须是一个对象`)
    return raw
  }
  return new Proxy(raw, baseHandlers)
}
