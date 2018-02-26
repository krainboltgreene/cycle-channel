/* eslint-disable flowtype/require-parameter-type, flowtype/require-return-type */
import {test} from "tap"
import {p} from "snabbdom-helpers"

import stateDriver from "./"

test("with a mapper", ({same, end}) => {
  const mapper = (state) => p({children: state.name})

  same(
    stateDriver(
      mapper
    )({
      data: {name: "Angela Rainbolt-Greene"},
      state: {name: "Kurtis Rainbolt-Greene"},
    }),
    {
      children: null,
      data: {
        "attrs": {},
        "class": {},
        "hook": {},
        "on": {},
        "props": {},
        "style": {},
      },
      elm: null,
      key: null,
      sel: "p",
      text: "Kurtis Rainbolt-Greene",
    }
  )
  end()
})

test("without a mapper", ({same, end}) => {
  same(
    stateDriver(
    )({
      data: {name: "Angela Rainbolt-Greene"},
      state: {name: "Kurtis Rainbolt-Greene"},
    }),
    {name: "Kurtis Rainbolt-Greene"}
  )
  end()
})
