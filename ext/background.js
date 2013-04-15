var Timer, Notification, tabSelect, historySelect, bookmarkSelect, select;
Timer = (function(){
  Timer.displayName = 'Timer';
  var prototype = Timer.prototype, constructor = Timer;
  constructor.finishTimer = function(){
    console.log('finishTimer');
    return Notification.show('Uruguay.png', 'timer', 'time up!');
  };
  constructor.startTimer = function(minutes){
    console.log(minutes);
    Notification.show('Uruguay.png', 'timer', 'timer start', 3);
    chrome.alarms.create("timer", {
      delayInMinutes: minutes
    });
    return chrome.alarms.onAlarm.addListener(constructor.finishTimer);
  };
  function Timer(){}
  return Timer;
}());
Notification = (function(){
  Notification.displayName = 'Notification';
  var prototype = Notification.prototype, constructor = Notification;
  constructor.show = function(icon, title, text, shownSeconds){
    var n;
    if (window.webkitNotifications) {
      console.log("Notifications are supported!");
      if (webkitNotifications.checkPermission() === 0) {
        n = webkitNotifications.createNotification(icon, title, text);
        n.show();
        if (shownSeconds) {
          setTimeout(function(){
            return n.cancel();
          }, shownSeconds * 1000);
        }
        return console.log('createNotification');
      } else {
        webkitNotifications.requestPermission();
        return console.log('requestPermission');
      }
    } else {
      return console.log("Notifications are not supported for this Browser/OS version yet.");
    }
  };
  function Notification(){}
  return Notification;
}());
tabSelect = function(){
  var dfd;
  dfd = $.Deferred();
  chrome.tabs.query({
    currentWindow: true
  }, function(tabs){
    var e;
    return dfd.resolve((function(){
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
    }()));
  });
  return dfd.promise();
};
historySelect = function(){
  var dfd;
  dfd = $.Deferred();
  chrome.history.search({
    text: '',
    maxResults: 1000
  }, function(hs){
    var e;
    return dfd.resolve((function(){
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
    }()));
  });
  return dfd.promise();
};
bookmarkSelect = function(){
  var dfd;
  dfd = $.Deferred();
  chrome.bookmarks.search("h", function(es){
    var e;
    return dfd.resolve((function(){
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
    }()));
  });
  return dfd.promise();
};
select = function(func){
  return $.when(tabSelect(), historySelect(), bookmarkSelect()).done(function(ts, hs, bs){
    return func(ts.concat(hs, bs));
  });
};
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse){
  console.log(msg);
  if (msg.mes === "makeSelectorConsole") {
    select(sendResponse);
  } else if (msg.mes === "decideSelector") {
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
    case "command":
      console.log("command");
      switch (msg.item.url) {
      case "timer":
        console.log('timer');
        Timer.startTimer(msg.item.query);
        break;
      default:
        console.log('other command');
      }
      break;
    default:
      chrome.tabs.create({
        url: msg.item.url
      });
    }
    select(sendResponse);
  }
  return true;
});
Timer.startTimer(1);