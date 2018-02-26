/* eslint-disable flowtype/require-parameter-type, flowtype/require-return-type */
import {test} from "tap"
import {from} from "most"
import streamSatisfies from "@unction/streamsatisfies"

import intoSink from "./"

test("with name", ({equal, end, doesNotThrow}) => {
  const driver = "view"
  const mapper = ({data}) => data.toLowerCase()
  const transmissions = from([
    {
      driver: "view",
      data: "BBB",
    },
    {
      driver: "view",
      data: "CCC",
    },
    {
      driver: "test",
      data: "DDD",
    },
  ])

  streamSatisfies(
    "'bbb'---'ccc'---|"
  )(
    (given) =>
      (expected) =>
        equal(given, expected)
  )(
    doesNotThrow
  )(
    ({length}) =>
      (position) => {
        equal(length, position)
        end()
      }
  )(
    intoSink(driver)(mapper)(transmissions)
  )
})

test("without name", ({equal, end, doesNotThrow}) => {
  const driver = null
  const mapper = ({data}) => data.toLowerCase()
  const transmissions = from([
    {
      driver: "view",
      data: "BBB",
    },
    {
      driver: "view",
      data: "CCC",
    },
    {
      driver: "test",
      data: "DDD",
    },
  ])

  streamSatisfies(
    "'bbb'---'ccc'---'ddd'---|"
  )(
    (given) =>
      (expected) =>
        equal(given, expected)
  )(
    doesNotThrow
  )(
    ({length}) =>
      (position) => {
        equal(length, position)
        end()
      }
  )(
    intoSink(driver)(mapper)(transmissions)
  )
})
