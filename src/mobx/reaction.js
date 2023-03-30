import { getNextId, globalState } from './utils';

export function runReactions() {
    const allReactions = globalState.pendingReactions
    let reaction;
    while (reaction = allReactions.shift()) {
        reaction.runReaction()
    }
}

function bindDependencies(derivation) {
    const { observing } = derivation
    observing.forEach((observable) => {
        observable.observers.add(derivation)
    })
}

export class Reaction {
    constructor(name = `Reaction@${getNextId()}`, onInvalidate) {
        this.name = name
        this.onInvalidate = onInvalidate
        this.observing = []
    }

    track(fn) {
        globalState.trackingDerivation = this
        fn.call()
        globalState.trackingDerivation = null
        bindDependencies(this)
    }

    schedule() {
        globalState.pendingReactions.push(this)
        runReactions()
    }

    runReaction() {
        this.onInvalidate();
    }

    onBecomeStale() {
        this.schedule()
    }

    dispose() {
        this.observing = []
    }
}