import equals from "@unction/equals"
import selectValues from "@unction/selectvalues"
import where from "@unction/where"

export default function onlyTransmissionsFor (name: string): Function {
  return selectValues(where({driver: equals(name)}))
}
