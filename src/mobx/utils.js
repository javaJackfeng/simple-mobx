export function isObject(value) {
    return value !== null && typeof value === "object";
}


export const $mobx = Symbol("mobx administration")

let mobxGuid = 0

export function getNextId() {
    return ++mobxGuid
}

export function getAdm(target) {
    return target[$mobx]
}

export function addHiddenProp(object, propName, value) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: true,
        configurable: true,
        value
    })
}

export const globalState = {
    pendingReactions: [],
    trackingDerivation: null
}