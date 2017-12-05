import mergeAllRight from "@unction/mergeallright"

import statesFrom from "./statesFrom"
import beatsFrom from "./beatsFrom"
import transmissionsFrom from "./transmissionsFrom"
import messagesFrom from "./messagesFrom"

import type {ChannelType} from "types"
import type {SinksType} from "types"

export default function channel (configuration: ChannelType): SinksType {
  const {signals} = configuration
  const {initialState} = configuration
  const {reactions} = configuration
  const {transformers} = configuration
  const {vents} = configuration
  const {drains} = configuration

  return messagesFrom(
    transmissionsFrom(
      transformers
    )(
      beatsFrom(
        mergeAllRight(
          signals
        )
      )(
        statesFrom(
          reactions
        )(
          initialState
        )(
          mergeAllRight(
            signals
          )
        )
      )
    )
  )(
    drains
  )(
    vents
  )
}
