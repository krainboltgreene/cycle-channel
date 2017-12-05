/* eslint-disable flowtype/require-parameter-type, flowtype/require-return-type */
import {test} from "tap"
import {p} from "snabbdom-helpers"

import dataDriver from "./"

test("with a mapper", ({same, end}) => {
  const mapper = (state) => p({children: state.name})

  same(
    dataDriver(
      mapper
    )({
      data: {name: "Angela Rainbolt-Greene"},
      state: {name: "Kurtis Rainbolt-Greene"},
    }),
    {
      children: null,
      data: {
        attrs: {
          aria: null,
          data: null,
        },
        hook: {},
        on: {},
        props: {},
        style: {},
      },
      elm: null,
      key: null,
      sel: "p",
      text: "Angela Rainbolt-Greene",
    }
  )
  end()
})

test("without a mapper", ({same, end}) => {
  same(
    dataDriver()({
      data: {name: "Angela Rainbolt-Greene"},
      state: {name: "Kurtis Rainbolt-Greene"},
    }),
    {name: "Angela Rainbolt-Greene"}
  )
  end()
})
