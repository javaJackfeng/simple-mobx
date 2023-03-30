import React, { useState, useEffect, useRef } from 'react'
import { Reaction } from "../mobx"

export function useObserver(fn) {
    const [ state,setState] = useState(1)
    const forceUpdate = () => setState((pre) => pre + 1)
    const reactionTrackingRef = useRef(null)
    if (!reactionTrackingRef.current) {
        const reaction = new Reaction(`observer`, () => {
            forceUpdate()
        })
        reactionTrackingRef.current = { reaction }
    }
    const { reaction } = reactionTrackingRef.current
    useEffect(() => {
        return () => {
            reactionTrackingRef.current.reaction.dispose();
            reactionTrackingRef.current = null;
        }
    }, [])
    let rendering
    reaction.track(() => {
        rendering = fn()
    })
    return rendering;
}


export function observer(baseComponent) {
    if (baseComponent.prototype.isReactComponent) {
        class WrapperClass extends React.Component {
            constructor(props) {
                super(props)
                this.reaction = new Reaction(`observer`, () => { this.forceUpdate() })
            }

            render() {
                let rendering
                const originRender = baseComponent.prototype.render
                this.reaction.track(() => {
                    rendering = originRender()
                })
                return rendering;
            }
        }
        WrapperClass.displayName = baseComponent.displayName || "ObserverComponent"
        return WrapperClass
    }
    const observerComponent = (props, ref) => {
        return useObserver(() => {
            return baseComponent(props, ref)
        })
    }
    return observerComponent
}
