import { isObject } from "./utils"
import { object } from "./observableObject"

function createObservable(v) {
    if (isObject(v)) {
        return object(v)
    }
}

export default createObservable