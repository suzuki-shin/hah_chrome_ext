var tabSelect, historySelect, bookmarkSelect;
tabSelect = function(f, list){
  return chrome.tabs.query({
    currentWindow: true
  }, function(tabs){
    var e;
    return f(list.concat((function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = tabs).length; i$ < len$; ++i$) {
        e = ref$[i$];
        results$.push({
          id: e.id,
          title: e.title,
          url: e.url,
          type: 'tab'
        });
      }
      return results$;
    }())));
  });
};
historySelect = function(f, list){
  return chrome.history.search({
    text: '',
    maxResults: 100
  }, function(hs){
    var e;
    return f(list.concat((function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = hs).length; i$ < len$; ++i$) {
        e = ref$[i$];
        results$.push({
          id: e.id,
          title: e.title,
          url: e.url,
          type: 'history'
        });
      }
      return results$;
    }())));
  });
};
bookmarkSelect = function(f, list){
  return chrome.bookmarks.search("h", function(es){
    var e;
    return f(list.concat((function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = es).length; i$ < len$; ++i$) {
        e = ref$[i$];
        if (e.url != null) {
          results$.push({
            id: e.id,
            title: e.title,
            url: e.url,
            type: 'bookmark'
          });
        }
      }
      return results$;
    }())));
  });
};
console.log('background');
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse){
  var historySelect_, bookmarkSelect_;
  console.log(msg);
  if (msg.mes === "makeSelectorConsole") {
    historySelect_ = function(list){
      return historySelect(sendResponse, list);
    };
    bookmarkSelect_ = function(list){
      return bookmarkSelect(historySelect_, list);
    };
    tabSelect(bookmarkSelect_, []);
  } else if (msg.mes === "keyUpSelectorDecide") {
    console.log(msg);
    switch (msg.item.type) {
    case "tab":
      console.log('tabs.update');
      chrome.tabs.update(parseInt(msg.item.id), {
        active: true
      });
      break;
    case "websearch":
      console.log('web search');
      chrome.tabs.create({
        url: msg.item.url + msg.item.query
      });
      break;
    default:
      chrome.tabs.create({
        url: msg.item.url
      });
    }
  }
  return true;
});