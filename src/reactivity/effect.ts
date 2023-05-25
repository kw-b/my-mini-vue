import { extend } from "./shared"

class ReactiveEffect {
  private _fn: any
  deps = []
  active: boolean = true
  onStop?: () => void
  constructor(fn, public scheduler?) {
    this._fn = fn
  }
  run() {
    activeEffect = this
    return this._fn()
  }
  stop() {
    if (this.active) {
      cleanUpEffect(this)
      this.active = false
      if(this.onStop){
        this.onStop()
      }
    }
  }
}

export const cleanUpEffect = (effect) => {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
}

const targetMap = new Map()

export const track = (target, key) => {
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
  if(!activeEffect) return 
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
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

let activeEffect

export const effect = (fn, options: any = {}) => {
  // fn
  const _effect = new ReactiveEffect(fn, options.scheduler)
  extend(_effect,options)
  _effect.run()

  // _effect.run 上没有 _fn方法
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export const stop = (runner) => {
  runner.effect.stop()
}
