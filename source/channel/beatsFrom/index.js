import xstream from "xstream"
import mapValues from "@unction/mapvalues"

import type {Stream} from "types"
import type {SignalType} from "types"
import type {StateType} from "types"
import type {BeatType} from "types"

export default function beatsFrom (signals: Stream<SignalType>): Function {
  return function beatsFromSignals (states: Stream<StateType>): Stream<BeatType> {
    return mapValues(
      ([state, signal]: [StateType, SignalType]): Stream<BeatType> => ({
        state,
        signal,
      })
    )(
      xstream.combine(states, signals)
    )
  }
}
