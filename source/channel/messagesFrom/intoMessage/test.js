/* eslint-disable flowtype/require-parameter-type, flowtype/require-return-type */
import {test} from "tap"
import xstream from "xstream"
import streamSatisfies from "@unction/streamsatisfies"

import intoSink from "./"

test("with name", ({equal, end}) => {
  const driver = "view"
  const mapper = ({data}) => data.toLowerCase()
  const transmissions = xstream.fromArray([
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
    end
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

test("without name", ({equal, end}) => {
  const driver = null
  const mapper = ({data}) => data.toLowerCase()
  const transmissions = xstream.fromArray([
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
    end
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
