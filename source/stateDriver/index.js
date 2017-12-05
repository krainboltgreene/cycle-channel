import key from "@unction/key"
import itself from "@unction/itself"

import type {TransmissionPartialFunctionType} from "types"
import type {TransmissionType} from "types"

export default function stateDriver (mapper: TransmissionPartialFunctionType = itself): Function {
  return function stateDriverMapper (transmission: TransmissionType): mixed {
    return mapper(key("state")(transmission))
  }
}
