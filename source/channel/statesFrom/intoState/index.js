import key from "@unction/key"

import type {ReactionsType} from "types"
import type {StateType} from "types"
import type {SignalType} from "types"

export default function intoState (reactions: ReactionsType): Function {
  return function intoStateIntents (state: StateType): Function {
    return function intoStateIntentsState (signal: SignalType): StateType {
      const {name} = signal
      const {payload} = signal
      const reaction = key(name)(reactions)

      if (!reaction) {
        return state
      }

      return reaction(state)(payload)
    }
  }
}
