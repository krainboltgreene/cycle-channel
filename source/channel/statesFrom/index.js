import reduceValues from "@unction/reducevalues"

import intoState from "./intoState"

import type {ReactionsType} from "types"
import type {StateType} from "types"
import type {Stream} from "types"
import type {SignalsType} from "types"

export default function statesFrom (reactions: ReactionsType): Function {
  return function statesFromReactions (initial: StateType): Function {
    return function statesFromReactionsInitial (signals: SignalsType): StreamType<StateType> {
      return reduceValues(
        intoState(reactions)
      )(
        initial
      )(
        signals
      )
    }
  }
}
