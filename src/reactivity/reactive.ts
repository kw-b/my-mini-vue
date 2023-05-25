import { mutableHandlers, readonlyHandlers } from "./baseHandlers"


export const enum ReactiveFlag {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v-isReadonly"
}

export const reactive = (raw) => createActiveObject(raw, mutableHandlers)

export const readonly = (raw) => createActiveObject(raw, readonlyHandlers)

function createActiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}

export const isReactive = (value) => {
  return !!value[ReactiveFlag.IS_REACTIVE]
};

export const isReadonly = (value) => {
  return !!value[ReactiveFlag.IS_READONLY]
};
