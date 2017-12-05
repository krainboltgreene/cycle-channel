export type Stream<T>= {}
export type PredicateFunctionType = mixed => boolean
export type DataType = mixed
export type StateType = {[key: string]: Array<mixed> | Object | Map<mixed, mixed> | Set<mixed> | string | number | boolean | null}
export type EventType = {target?: {attributes: mixed}, type: string}
export type ParameterType = {[name: string]: mixed}
export type PayloadType = {event?: EventType} & ParameterType
export type IntentType = {trigger: string, name: Array<string>, parameters: ParameterType}
export type SignalType = {name: string, payload: PayloadType}
export type SignalsType = Stream<SignalType>
export type BeatType = {state: StateType, signal: SignalType}
export type MessageType = {driver: string, data: mixed}
export type TransmissionType = BeatType & MessageType
export type TransformerType = StateType => PayloadType => MessageType
export type TransformersType = {[name: string]: TransformerType}
export type ReactionType = StateType => PayloadType => StateType
export type ReactionsType = {[name: string]: ReactionType}
export type TransmissionPartialFunctionType = TransmissionType => (StateType | DataType)
export type SinkMapperFunctionType = TransmissionPartialFunctionType => mixed
export type SinkMappersType = {[name: string]: SinkMapperFunctionType}
export type TriggersType = {[name: string]: Array<string>}
export type SinkType = Stream<mixed>
export type SinksType = {[name: string]: SinkType}
export type ChannelType = {
  initialState: {},
  signals: Array<SignalType>,
  reactions: ReactionsType,
  transformers: TransformersType,
  vents: SinkMappersType,
  drains: SinkMappersType,
}
