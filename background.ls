tabSelect = (f, list) ->
  chrome.tabs.query({currentWindow: true}, (tabs) ->
    f(list.concat([{id: e.id, title: e.title, url: e.url, type: 'tab'} for e in tabs]))
  )

historySelect = (f, list) ->
  chrome.history.search({text:'', maxResults: 100}, (hs) ->
    f(list.concat([{id: e.id, title: e.title, url: e.url, type: 'history'} for e in hs]))
  )

bookmarkSelect = (f, list) ->
  chrome.bookmarks.search("h", (es) ->
    f(list.concat([{id: e.id, title: e.title, url: e.url, type: 'bookmark'} for e in es when e.url?]))
  )

console.log('background')

chrome.extension.onMessage.addListener((msg, sender, sendResponse) ->
  console.log(msg)
  if msg.mes == "makeSelectorConsole"
    historySelect_ = (list) -> historySelect(sendResponse, list)
    bookmarkSelect_ = (list) -> bookmarkSelect(historySelect_, list)
    tabSelect(bookmarkSelect_, [])
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
  true
)
