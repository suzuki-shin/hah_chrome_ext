tabSelect =->
  dfd = $.Deferred()
  chrome.tabs.query({currentWindow: true}, (tabs) ->
    dfd.resolve([{id: e.id, title: e.title, url: e.url, type: 'tab'} for e in tabs])
  )
  dfd.promise()

historySelect =->
  dfd = $.Deferred()
  chrome.history.search({text:'', maxResults: 1000}, (hs) ->
    dfd.resolve([{id: e.id, title: e.title, url: e.url, type: 'history'} for e in hs])
  )
  dfd.promise()

bookmarkSelect =->
  dfd = $.Deferred()
  chrome.bookmarks.search("h", (es) ->
    dfd.resolve([{id: e.id, title: e.title, url: e.url, type: 'bookmark'} for e in es when e.url?])
  )
  dfd.promise()

select = (func) ->
  $.when(
    tabSelect(),
    historySelect(),
    bookmarkSelect()
  ).done((ts, hs, bs) ->
    func(ts.concat(hs, bs))
  )

chrome.extension.onMessage.addListener((msg, sender, sendResponse) ->
  console.log(msg)
  if msg.mes == "makeSelectorConsole"
    select(sendResponse)
  else if msg.mes == "keyUpSelectorDecide"
    console.log(msg)
    switch msg.item.type
    case "tab"
      console.log('tabs.update')
      chrome.tabs.update(parseInt(msg.item.id), {active: true})
    case "websearch"
      console.log('web search')
      chrome.tabs.create({url: msg.item.url + msg.item.query})
    default
      chrome.tabs.create({url: msg.item.url})
    select(sendResponse)
  true
)
