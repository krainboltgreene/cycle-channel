# Intent

An intent is the binding of a specific reaction(s) on a specific event to an interactive part of the view.

``` javascript
const intents = {
  searchFor: intentOn("change")("updateFormField"),
}
```

This will get merged with an element:

``` javascript
const presentation = (state) => {
  return main({
    children: [
      h1({children: "Google"}),

      withIntent(searchFor({form: "search", field: "query"}))(input({children: state.ephemeral.forms.search.query})),

      p({children: "See below for the results"}),
      ul({
        children: mapValues((result) => li({children: result.title}))(state.resources.results)
      })
    ]
  })
}
```
