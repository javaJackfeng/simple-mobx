import { getNextId } from "./utils"
import { Reaction } from "./reaction"

export default function autorun(view) {
    const name = `AutoRun@${getNextId()}`
    const reaction = new Reaction(name, function(){ this.track(view) })
    reaction.schedule()
}