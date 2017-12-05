
import {run} from "@cycle/run"
import {makeDOMDriver} from "@cycle/dom"
import storageDriver from "@cycle/storage"
import {makeHTTPDriver} from "@cycle/http"
import {channel} from "cycle-channel"
import {stateDriver} from "cycle-channel"
import {dataDriver} from "cycle-channel"
import {viewEventSignals} from "cycle-channel-dom"
import {networkResponseSignals} from "cycle-channel-http"
import {storageReadSignals} from "cycle-channel-storage"
import intent from "snabbdom-intent"
import mergeDeepRight from "@unction/mergedeepright"
import mapValues from "@unction/mapvalues"
import recordFrom from "@unction/recordfrom"
import groupBy from "@unction/groupby"
import indexBy from "@unction/indexby"
import keyChain from "@unction/keychain"
import key from "@unction/key"
import {main} from "snabbdom-helpers"
import {h1} from "snabbdom-helpers"
import {input} from "snabbdom-helpers"
import {p} from "snabbdom-helpers"
import {ul} from "snabbdom-helpers"
import {li} from "snabbdom-helpers"


const initialState = {}
const reactions = {
  updateFormField: (state) => ({event, form, field}) => {
    return mergeDeepRight(state)(recordFrom(["ephemeral", "forms", form, field])(event.target.value))
  },
  mergeResources: (state) => ({data}) => {
    return mergeDeepRight(state)({resources: treeify([groupBy(keyChain(["attributes", "type"])), indexBy(key("id"))])})
  },
}
const transformers = {
  fetchSearchResult: (state) => ({event}) => {
    return {
      dxriver: "network",
      data: {
        method: "GET",
        url: `https://api.example.com/search?query=${event.target.value}`,
        headers: {Authorization: `Basic ${state.ephemeral.authorization}`},
      },
    }
  },
}
const intents = {onChangeSearch: intent({change: ["updateFormField", "fetchSearchResult"]})}
const render = ({state}) => {
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
    signals: [
      viewEventSignals(view),
      networkResponseSignals(network),
      storageReadSignals(storage),
    ],
    initialState,
    reactions,
    transformers,
    drains: {view: stateDriver(render)},
    vents: {
      network: dataDriver(),
      storage: dataDriver(),
    },
  })
}
const dxrivers = {
  view: makeDOMDriver("body"),
  network: makeHTTPDriver(),
  storage: storageDriver(),
}

run(application, dxrivers)
