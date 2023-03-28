import { getNextId, addHiddenProp, getAdm, $mobx, globalState } from './utils.js';

export function reportObserved(observable) {
    const derivation = globalState.trackingDerivation
    if (derivation !== null) {
        derivation.observing.push(observable)
    }
}

export function propagateChanged(observable) {
    const observers = observable.observers;
    observers.forEach((observer) => {
        observer.onBecomeStale()
    })
}

export class ObservableValue {
    constructor(value) {
        this.value = value
        this.observers = new Set()
    }
    get() {
        reportObserved(this)
        return this.value
    }
    // set(value){
    //     this.value = value
    // }
    setNewValue(newValue) {
        this.value = newValue
        propagateChanged(this)
    }
}

export class ObservableObjectAdministration {
    constructor(target, values, name) {
        this.target = target
        this.values = values
        this.name = name
    }

    get(key) {
        return this.target[key]
    }

    set(key, value) {
        if (this.values.has(key)) {
            return this.setObservablePropValue(key, value)
        }
        // this.target[key] = value
    }

    extend(key, descriptor) {
        this.defineObservableProperty(key, descriptor.value)
    }

    getObservablePropValue(key) {
        return this.values.get(key).get()
    }

    setObservablePropValue(key, value) {
        const observable = this.values.get(key)
        observable.setNewValue(value)
        return true;
        // return this.values.get(key).set(value)
    }

    defineObservableProperty(key, value) {
        const descriptor = {
            configure: true,
            enumerable: true,
            get() {
                return this[$mobx].getObservablePropValue(key)
            },
            set(value) {
                return this[$mobx].setObservablePropValue(key, value)
            }
        }
        Object.defineProperty(this.target, key, descriptor)
        const observable = new ObservableValue(value)
        this.values.set(key, observable)
    }
} 

export function asObservableObject(target) {
    const name = `ObservableObject@${getNextId()}`
    const adm = new ObservableObjectAdministration(target, new Map(), name)
    addHiddenProp(target, $mobx, adm)
    return target
}


const objectProxyTraps = {
    get(target, key) {
        return getAdm(target).get(key)
    },
    set(target, key, value) {
        return getAdm(target).set(key, value)
    }
}

export function asDynamicObservableObject(target) {
    asObservableObject(target)
    const proxy = new Proxy(target, objectProxyTraps)
    return proxy
}

export function extendObservable(proxyObject, properties) {
    const descriptors = Object.getOwnPropertyDescriptors(properties)
    const adm = proxyObject[$mobx]
    Reflect.ownKeys(descriptors).forEach((key) => {
        adm.extend(key, descriptors[key])
    })
    return proxyObject;
}

export function object(target) {
    const observableObject = asDynamicObservableObject({})
    return extendObservable(observableObject, target);
}