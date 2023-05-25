import { track, trigger } from "./effect"
import { ReactiveFlag } from "./reactive"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter(isReadonly = false) {
  return function (target, key) {
    const res = Reflect.get(target, key)
    if (key === ReactiveFlag.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlag.IS_READONLY) {
      return isReadonly
    }
    // [x] 依赖收集
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter() {
  return function (target, key, value) {
    const res = Reflect.set(target, key, value)
    // [x] 触发依赖
    trigger(target, key)
    return res
  }
}

export const mutableHandlers = {
  get,
  set,
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key:${key} set 失败, 因为 target 是 readonly`, target)
    return true
  },
}
