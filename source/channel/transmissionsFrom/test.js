/* eslint-disable flowtype/require-parameter-type, flowtype/require-return-type */
import {test} from "tap"
import xstream from "xstream"
import streamSatisfies from "@unction/streamsatisfies"

import transmissionsFrom from "./"

test(({same, equal, end}) => {
  const actions = {
    requestSearch: (state) => ({event}) => {
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
  const beats = xstream.from([
    {
      state: {
        ephemeral: {
          authorization: "xxx",
          forms: {},
        },
        resources: {},
      },
      signal: {
        name: "requestSearch",
        payload: {
          form: "search",
          field: "query",
          event: {
            type: "click",
            target: {value: "hello"},
          },
        },
      },
    },
    {
      state: {
        ephemeral: {
          authorization: "xxx",
          forms: {},
        },
        resources: {},
      },
      signal: {
        name: "requestSearch",
        payload: {
          form: "search",
          field: "query",
          event: {target: {value: "goodbye"}},
        },
      },
    },
  ])

  streamSatisfies(
    [
      {
        driver: "network",
        state: {
          ephemeral: {
            authorization: "xxx",
            forms: {},
          },
          resources: {},
        },
        signal: {
          name: "requestSearch",
          payload: {
            form: "search",
            field: "query",
            event: {
              type: "click",
              target: {value: "hello"},
            },
          },
        },
        data: {
          headers: {Authorization: "Basic xxx"},
          method: "GET",
          params: {query: "hello"},
          url: "http://api.example.com/v1/searches/",
        },
      },
      {
        driver: "network",
        state: {
          ephemeral: {
            authorization: "xxx",
            forms: {},
          },
          resources: {},
        },
        signal: {
          name: "requestSearch",
          payload: {
            form: "search",
            field: "query",
            event: {target: {value: "goodbye"}},
          },
        },
        data: {
          headers: {Authorization: "Basic xxx"},
          method: "GET",
          params: {query: "goodbye"},
          url: "http://api.example.com/v1/searches/",
        },
      },
    ]
  )(
    (given) =>
      (expected) =>
        same(given, expected)
  )(
    end
  )(
    ({length}) =>
      (position) => {
        equal(length, position)
        end()
      }
  )(
    transmissionsFrom(actions)(beats)
  )
})
