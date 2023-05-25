import { extend } from "./shared"

let activeEffect
let shouldTrack

class ReactiveEffect {
  private _fn: any
  deps = []
  active: boolean = true
  onStop?: () => void
  constructor(fn, public scheduler?) {
    this._fn = fn
  }
  run() {
    // 1. 会收集依赖
    // shouldTrack 来做区分
    if (!this.active) {
      return this._fn()
    }

    shouldTrack = true
    activeEffect = this
    const result = this._fn()

    //rest
    shouldTrack = false

    return result
  }
  stop() {
    if (this.active) {
      cleanUpEffect(this)
      this.active = false
      if (this.onStop) {
        this.onStop()
      }
    }
  }
}

export const cleanUpEffect = (effect) => {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

const targetMap = new Map()

export const track = (target, key) => {
  if (!isTracking()) return
  // target -> key -> dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  // 已经在 dep 中
  if (dep.has(activeEffect)) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export const trigger = (target, key) => {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export const effect = (fn, options: any = {}) => {
  // fn
  const _effect = new ReactiveEffect(fn, options.scheduler)
  extend(_effect, options)
  _effect.run()

  // _effect.run 上没有 _fn方法
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export const stop = (runner) => {
  runner.effect.stop()
}
