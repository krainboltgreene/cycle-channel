/* eslint-disable flowtype/require-parameter-type, flowtype/require-return-type */
import {test} from "tap"
import xstream from "xstream"
import streamSatisfies from "@unction/streamsatisfies"
import {p} from "snabbdom-helpers"

import messagesFrom from "./"

test("drain only", ({similar, equal, end}) => {
  const render = ({state}) => p({children: state.name || "No one"})
  const transmissions = xstream.from([
    {
      driver: "heartbeat",
      signal: "test",
      state: {},
      data: {},
    },
    {
      driver: "view",
      signal: "updateName",
      state: {name: "Angela Englund"},
      data: {},
    },
    {
      driver: "view",
      signal: "updateName",
      state: {name: "Angela Rainbolt-Greene"},
      data: {},
    },
  ])
  const drains = {view: render}
  const {view} = messagesFrom(transmissions)(drains)({})

  streamSatisfies(
    [
      {
        sel: "p",
        text: "No one",
      },
      {
        sel: "p",
        text: "Angela Englund",
      },
      {
        sel: "p",
        text: "Angela Rainbolt-Greene",
      },

    ]
  )(
    (given) =>
      (expected) =>
        similar(given, expected)
  )(
    end
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

test("vent only", ({same, equal, end}) => {
  const passthrough = ({data}) => data
  const transmissions = xstream.from([
    {
      driver: "heartbeat",
      signal: "test",
      state: {},
      data: {},
    },
    {
      driver: "network",
      signal: "requestWebpage",
      state: {},
      data: {url: "https://www.example.com"},
    },
    {
      driver: "network",
      signal: "requestApi",
      state: {},
      data: {url: "https://api.example.com"},
    },
  ])
  const drains = {network: passthrough}
  const {network} = messagesFrom(transmissions)({})(drains)

  streamSatisfies(
    [
      {url: "https://www.example.com"},
      {url: "https://api.example.com"},
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
    network
  )
})
