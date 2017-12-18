# cycle-channel

![Tests][BADGE_TRAVIS]
![Stability][BADGE_STABILITY]
![Dependencies][BADGE_DEPENDENCY]

A single pipeline of sources to sinks. The point of cycle-channel is to provide a unified interface for incoming streams to be mapped to outgoing streams. This kind of logic often gets written by hand and instead I prefer to have something stable.


## Usage

For this example I've removed the `import` statements for anything that isn't really important.


``` javascript
import {channel} from "cycle-channel"
import {stateDriver} from "cycle-channel"
import {dataDriver} from "cycle-channel"
import {viewEventSignals} from "cycle-channel-dom"
import {networkResponseSignals} from "cycle-channel-http"
import {storageReadSignals} from "cycle-channel-storage"
import intent from "snabbdom-intent"

// NOTE: See https://github.com/krainboltgreene/snabbdom-intents for more information
const intents = {
  onChangeSearch: intent({change: ["updateFormField", "fetchSearchResult"]})
}

// NOTE: This function will render our view layer.
const render = ({state}) => {

  // NOTE: See https://github.com/krainboltgreene/snabbdom-intents for more information
  const withSearch = intents.onChangeSearch({
    form: "search",
    field: "query",
  })

  return main({
    children: [
      h1({children: "Google"}),
      input(withSearch({children: state.ephemeral.forms.search.query})),
      p({children: "See below for the results"}),
      ul({children: mapValues((result) => li({children: result.title}))(state.resources.results)}),
    ],
  })
}
const application = ({view, network, storage}) => {
  return channel({
    // NOTE: Signals are streams of signal emits, mapped from sources. The below functions each know how to turn a native event from that source into a standardized signal that can be reacted to or transformed into a message.
    signals: [
      // NOTE: For example, this is a stream of signals from view layer events
      viewEventSignals(view),

      // NOTE: This is a stream of signals from http responses
      networkResponseSignals(network),

      // NOTE: This is a stream of signals from the local storage driver
      storageReadSignals(storage),
    ],

    // NOTE: This is the start of your application's state. You might want something more complicated than this.
    initialState: {},

    // NOTE: Reactions are the functions that fire in response to certain signals. They receive the current state and the payload). They return the next state:
    reactions: {
      // reaction:: State => {event?: Event, [name?: Key]: mixed} => State
      updateFormField: (state) => ({event, form, field}) => {
        return mergeDeepRight(
          state
        )(
          recordFrom(["ephemeral", "forms", form, field])(event.target.value)
        )
      },
      mergeResources: (state) => ({data}) => {
        return mergeDeepRight(
          state
        )({
          resources: treeify([groupBy(keyChain(["attributes", "type"])), indexBy(key("id"))])(data)
        })
      },
    },

    // NOTE: Transforms are functions that take state and a payload and turn them into transmissions meant for drivers. For example, you may want a button press to trigger a http request. They must return a Transmission:
    transformers: {
      // transform:: State => {event?: Event, [name: Key]?: mixed} => {driver: string, data: mixed}
      fetchSearchResult: (state) => ({event}) => {
        return {
          driver: "network",
          data: {
            method: "GET",
            url: `https://api.example.com/search?query=${event.target.value}`,
            headers: {Authorization: `Basic ${state.ephemeral.authorization}`},
          },
        }
      },
    },
    // NOTE: Drains are sinks that always happen, regardless of the type of message. Views are a good example, because state might have changed
    drains: {view: stateDriver(render)},

    // NOTE: Vents are sinks that only happen when a Message has the `driver` property of the same name as the key, so a the above search request would go down the network sink.
    vents: {
      network: dataDriver(),
      storage: dataDriver(),
    },
  })
}
const drivers = {
  view: makeDOMDriver("body"),
  network: makeHTTPDriver(),
  storage: storageDriver(),
}

run(application, drivers)
```

[BADGE_TRAVIS]: https://img.shields.io/travis/krainboltgreene/cycle-channel.svg?maxAge=2592000&style=flat-square
[BADGE_STABILITY]: https://img.shields.io/badge/stability-strong-green.svg?maxAge=2592000&style=flat-square
[BADGE_DEPENDENCY]: https://img.shields.io/david/krainboltgreene/cycle-channel.svg?maxAge=2592000&style=flat-square
