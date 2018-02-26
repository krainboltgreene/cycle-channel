/* eslint-disable flowtype/require-parameter-type, flowtype/require-return-type */
import {test} from "tap"
import {from} from "most"
import {of} from "most"
import streamSatisfies from "@unction/streamsatisfies"

import beatsFrom from "./"

test("Multiple signals", ({same, equal, doesNotThrow, end}) => {
  const signals = from([
    {
      name: "updateFormField",
      payload: {
        form: "search",
        field: "query",
        event: {
          type: "click",
          target: {value: "hello"},
        },
      },
    },
    {
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
  ])
  const states = of({})

  streamSatisfies(
    [
      {
        signal: {
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
        state: {},
      },
      {
        signal: {
          name: "requestSearch",
          payload: {
            event: {
              target: {value: "hello"},
              type: "click",
            },
            form: "search",
            field: "query",
          },
        },
        state: {},
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
    beatsFrom(signals)(states)
  )
})

test("Single signal", ({same, equal, doesNotThrow, end}) => {
  const signals = from([
    {
      name: "updateFormField",
      payload: {
        form: "search",
        field: "query",
      },
    },
  ])
  const states = of({})

  streamSatisfies(
    [
      {
        signal: {
          name: "updateFormField",
          payload: {
            form: "search",
            field: "query",
          },
        },
        state: {},
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
    beatsFrom(signals)(states)
  )
})
