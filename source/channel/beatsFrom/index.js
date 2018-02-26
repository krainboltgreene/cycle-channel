import {combine} from "most"

import type {StreamType} from "types"
import type {SignalType} from "types"
import type {StateType} from "types"
import type {BeatType} from "types"

export default function beatsFrom (signals: StreamType<SignalType>): Function {
  return function beatsFromSignals (states: StreamType<StateType>): StreamType<BeatType> {
    return combine(
      (state: StateType, signal: SignalType): BeatType => ({
        state,
        signal,
      }),
      states,
      signals
    )
  }
}
