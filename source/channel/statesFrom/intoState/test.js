/* eslint-disable flowtype/require-parameter-type, flowtype/require-return-type */
import {test} from "tap"
import mergeDeepRight from "@unction/mergedeepright"
import recordFrom from "@unction/recordfrom"
import treeify from "@unction/treeify"
import key from "@unction/key"
import keyChain from "@unction/keychain"
import groupBy from "@unction/groupby"
import indexBy from "@unction/indexby"

import intoState from "./"

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

test(({same, end}) => {
  const signals = {
    name: "updateFormField",
    payload: {
      event: {target: {value: "hello"}},
      form: "search",
      field: "query",
    },
  }

  same(
    intoState(reactions)(initialState)(signals),
    {
      resources: {},
      ephemeral: {
        forms: {search: {query: "hello"}},
        authorization: "xxx",
      },
    }
  )

  end()
})

test(({same, end}) => {
  const signals = {
    name: "example",
    payload: {
      event: {target: {value: "hello"}},
      form: "search",
      field: "query",
    },
  }

  same(
    intoState(reactions)(initialState)(signals),
    {
      resources: {},
      ephemeral: {
        forms: {},
        authorization: "xxx",
      },
    }
  )

  end()
})
