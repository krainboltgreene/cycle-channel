import key from "@unction/key"
import itself from "@unction/itself"

import type {TransmissionPartialFunctionType} from "types"
import type {TransmissionType} from "types"

export default function dataDriver (mapper: TransmissionPartialFunctionType = itself): Function {
  return function dataDriverMapper (transmission: TransmissionType): mixed {
    return mapper(key("data")(transmission))
  }
}
