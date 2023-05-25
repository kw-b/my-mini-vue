class ReactiveEffect {
  private _fn: any
  constructor(fn,public scheduler?) {
    this._fn = fn
  }
  run() {
    activeEffect = this
    return this._fn()
  }
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
  dep.add(activeEffect)
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

export const effect = (fn, options:any={}) => {
  // fn
  const _effect = new ReactiveEffect(fn,options.scheduler)

  _effect.run()

  // _effect.run 上没有 _fn方法
  return _effect.run.bind(_effect)
}
