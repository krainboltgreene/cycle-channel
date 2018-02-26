/* eslint-disable flowtype/require-parameter-type, flowtype/require-return-type, import/max-dependencies */
import {test} from "tap"
import {from} from "most"
import streamSatisfies from "@unction/streamsatisfies"
import mergeDeepRight from "@unction/mergedeepright"
import recordFrom from "@unction/recordfrom"
import treeify from "@unction/treeify"
import key from "@unction/key"
import groupBy from "@unction/groupby"
import indexBy from "@unction/indexby"
import {input} from "snabbdom-helpers"

import stateDriver from "../stateDriver"
import dataDriver from "../dataDriver"
import channel from "./"

const signals = [
  from([
    {
      name: "updateFormField",
      payload: {
        event: {
          target: {value: "hello"},
          type: "click",
        },
        form: "search",
        field: "query",
      },
    },
    {
      name: "fetchSearch",
      payload: {
        event: {
          target: {value: "hello"},
          type: "click",
        },
        form: "search",
        field: "query",
      },
    },
    {
      name: "mergeResources",
      payload: {
        data: [
          {
            id: "a",
            type: "search-results",
            attributes: {
              title: "Hello, World",
              rank: 1,
            },
          },
        ],
      },
    },
  ]),
]
const initialState = {
  resources: {},
  ephemeral: {
    forms: {},
    authorization: "xxx",
  },
}
const render = (state) => input({attrs: {value: state.ephemeral.forms.search.query}})
const reactions = {
  updateFormField: (state) => ({event, form, field}) => {
    return mergeDeepRight(state)(recordFrom(["ephemeral", "forms", form, field])(event.target.value))
  },
  mergeResources: (state) => ({data}) => {
    return mergeDeepRight(state)({resources: treeify([groupBy(key("type")), indexBy(key("id"))])(data)})
  },
}
const transformers = {
  fetchSearch: (state) => ({event}) => {
    return {
      driver: "network",
      data: {
        method: "GET",
        url: "http://api.example.com/v1/searches/",
        params: {query: event.target.value},
        headers: {Authorization: `Basic ${state.ephemeral.authorization}`},
      },
    }
  },
}

test("drain", ({similar, equal, end, doesNotThrow}) => {
  const {view} = channel({
    signals,
    initialState,
    reactions,
    transformers,
    vents: {network: dataDriver()},
    drains: {view: stateDriver(render)},
  })

  streamSatisfies(
    [
      {
        sel: "input",
        data: {attrs: {value: "hello"}},
      },
      {
        sel: "input",
        data: {attrs: {value: "hello"}},
      },
      {
        sel: "input",
        data: {attrs: {value: "hello"}},
      },
    ]
  )(
    (given) => (expected) => similar(given, expected)
  )(
    doesNotThrow
  )(
    ({length}) =>
      (position) => {
        equal(length, position)
        end()
      }
  )(
    view
  )
})

test("vent", ({same, equal, end, doesNotThrow}) => {
  const {network} = channel({
    signals,
    initialState,
    reactions,
    transformers,
    vents: {network: dataDriver()},
    drains: {view: stateDriver(render)},
  })

  streamSatisfies(
    [
      {
        method: "GET",
        url: "http://api.example.com/v1/searches/",
        params: {query: "hello"},
        headers: {Authorization: "Basic xxx"},
      },
    ]
  )(
    (given) => (expected) => same(given, expected)
  )(
    doesNotThrow
  )(
    ({length}) =>
      (position) => {
        equal(length, position)
        end()
      }
  )(
    network
  )
})
