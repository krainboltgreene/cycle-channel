/* eslint-disable flowtype/require-parameter-type, flowtype/require-return-type */
import {test} from "tap"

import intoTransmission from "./"

test(({same, end}) => {
  const transformers = {
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
  const beat = {
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
  }

  same(
    intoTransmission(transformers)(beat),
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
        method: "GET",
        url: "http://api.example.com/v1/searches/",
        params: {query: "hello"},
        headers: {Authorization: "Basic xxx"},
      },
    }
  )

  end()
})

test(({same, end}) => {
  const transformers = {
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
  const beat = {
    signal: {
      name: "requestSearchs",
      payload: {
        form: "search",
        field: "query",
        event: {
          type: "click",
          target: {value: "hello"},
        },
      },
    },
    state: {
      ephemeral: {
        authorization: "xxx",
        forms: {},
      },
      resources: {},
    },
  }

  same(
    intoTransmission(transformers)(beat),
    {
      driver: "heartbeat",
      state: {
        ephemeral: {
          authorization: "xxx",
          forms: {},
        },
        resources: {},
      },
      signal: {
        name: "requestSearchs",
        payload: {
          form: "search",
          field: "query",
          event: {
            type: "click",
            target: {value: "hello"},
          },
        },
      },
      data: {},
    }
  )

  end()
})
