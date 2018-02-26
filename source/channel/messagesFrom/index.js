
import mapWithValueKey from "@unction/mapwithvaluekey"
import mapValues from "@unction/mapvalues"
import mergeRight from "@unction/mergeright"

import intoMessage from "./intoMessage"

import type {SinksType} from "types"
import type {Stream} from "types"
import type {TransmissionPartialFunctionType} from "types"
import type {SinkMappersType} from "types"
import type {TransmissionType} from "types"

export default function sinksFrom (transmissions: StreamType<TransmissionType>): Function {
  return function sinksFromTransmissions (drains: SinkMappersType): Function {
    return function sinksFromTransmissionsDrains (vents: SinkMappersType): SinksType {
      return mergeRight(
        mapWithValueKey(
          (mapper: TransmissionPartialFunctionType): Function =>
            (name: string): StreamType<mixed> =>
              intoMessage(name)(mapper)(transmissions)
        )(
          vents
        )
      )(
        mapValues(
          (mapper: TransmissionPartialFunctionType): Function =>
            intoMessage(null)(mapper)(transmissions)
        )(
          drains
        )
      )
    }
  }
}
