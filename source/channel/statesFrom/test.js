/* eslint-disable flowtype/require-parameter-type, flowtype/require-return-type, import/max-dependencies */
import {test} from "tap"
import streamSatisfies from "@unction/streamsatisfies"
import mergeDeepRight from "@unction/mergedeepright"
import recordFrom from "@unction/recordfrom"
import treeify from "@unction/treeify"
import key from "@unction/key"
import keyChain from "@unction/keychain"
import groupBy from "@unction/groupby"
import indexBy from "@unction/indexby"
import xstream from "xstream"

import statesFrom from "./"

const reactions = {
  updateFormField: (state) => ({event, form, field}) => {
    return mergeDeepRight(state)(recordFrom(["ephemeral", "forms", form, field])(event.target.value))
  },
  mergeResources: (state) => ({data}) => {
    return mergeDeepRight(state)({resources: treeify([groupBy(keyChain(["attributes", "type"])), indexBy(key("id"))])(data)})
  },
}
const initialState = {
  resources: {},
  ephemeral: {
    forms: {},
    authorization: "xxx",
  },
}

test(({same, equal, end}) => {
  const signals = xstream.of({
    name: "updateFormField",
    payload: {
      form: "search",
      field: "query",
      event: {
        type: "click",
        target: {value: "hello"},
      },
    },
  })

  streamSatisfies(
    [
      {
        ephemeral: {
          authorization: "xxx",
          forms: {},
        },
        resources: {},
      },
      {
        ephemeral: {
          authorization: "xxx",
          forms: {search: {query: "hello"}},
        },
        resources: {},
      },
    ]
  )(
    (given) => (expected) => same(given, expected)
  )(
    end
  )(
    ({length}) =>
      (position) => {
        equal(length, position)
        end()
      }
  )(
    statesFrom(reactions)(initialState)(signals)
  )
})
