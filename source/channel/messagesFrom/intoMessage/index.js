
import mapValues from "@unction/mapvalues"

import onlyTransmissionsFor from "./onlyTransmissionsFor"

import type {Stream} from "types"
import type {TransmissionPartialFunctionType} from "types"
import type {TransmissionType} from "types"
import type {MessageType} from "types"

export default function intoMessage (type: string | null): Function {
  return function intoMessageType (mapper: TransmissionPartialFunctionType): Function {
    return function intoMessageTypeMapper (transmissions: StreamType<TransmissionType>): StreamType<MessageType> {
      if (type) {
        return mapValues(
          mapper
        )(
          onlyTransmissionsFor(
            type
          )(
            transmissions
          )
        )
      }

      return mapValues(
        mapper
      )(
        transmissions
      )
    }
  }
}
