import { mutableHandlers, readonlyHandlers } from "./baseHandlers"

export const reactive = (raw) => createActiveObject(raw, mutableHandlers)

export const readonly = (raw) => createActiveObject(raw, readonlyHandlers)

function createActiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}
