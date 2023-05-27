import { isTracking, trackEffects, triggerEffects } from "./effect"
import { reactive } from "./reactive"
import { hasChanged, isObject } from "./shared"

class RefImpl {
  private _value: any
  public dep
  private _rawValue: any
  public __v_isRef = true
  constructor(value) {
    this._rawValue = value
    this._value = convert(value)
    this.dep = new Set()
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  // [x]
  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue
      this._value = convert(newValue)
      triggerEffects(this.dep)
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}

export const ref = (value) => {
  return new RefImpl(value)
}

export const isRef = (ref) => !!ref.__v_isRef

export const unRef = (ref) => (isRef(ref) ? ref.value : ref)
