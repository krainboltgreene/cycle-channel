import mapValues from "@unction/mapvalues"

import intoTransmission from "./intoTransmission"

import type {TransformersType} from "types"
import type {Stream} from "types"
import type {BeatType} from "types"
import type {TransmissionType} from "types"

export default function transmissionFrom (transformers: TransformersType): Function {
  return function transmissionFromActions (beats: StreamType<BeatType>): StreamType<TransmissionType> {
    return mapValues(
      intoTransmission(transformers)
    )(
      beats
    )
  }
}
