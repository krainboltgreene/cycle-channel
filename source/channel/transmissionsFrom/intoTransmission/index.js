import key from "@unction/key"

import type {TransformersType} from "types"
import type {BeatType} from "types"
import type {TransmissionType} from "types"
import type {TransformerType} from "types"

export default function intoTransmission (transformers: TransformersType): Function {
  return function intoTransmissionTransforms (beat: BeatType): TransmissionType {
    const {signal} = beat
    const {state} = beat
    const {name} = signal
    const {payload} = signal
    const transformer: TransformerType = key(name)(transformers)

    if (!transformer) {
      return {
        signal,
        driver: "heartbeat",
        data: {},
        state,
      }
    }

    return {
      signal,
      ...transformer(state)(payload),
      state,
    }
  }
}
