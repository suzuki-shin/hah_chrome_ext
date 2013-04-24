var TimerInstance, Timer, Notification, tabSelect, historySelect, bookmarkSelect, select;
TimerInstance = (function(){
  TimerInstance.displayName = 'TimerInstance';
  var prototype = TimerInstance.prototype, constructor = TimerInstance;
  function TimerInstance(startTime, minutes){
    this.startTime = startTime;
    this.minutes = minutes;
  }
  prototype.startTime = void 8;
  prototype.minutes = 0;
  return TimerInstance;
}());
Timer = (function(){
  Timer.displayName = 'Timer';
  var prototype = Timer.prototype, constructor = Timer;
  constructor.timerInstances = [];
  constructor.startTimer = function(minutes){
    var startTime;
    console.log(minutes);
    Notification.show('timer.png', 'timer start', minutes + ' min', 3);
    startTime = new Date();
    constructor.timerInstances[startTime.getTime()] = new TimerInstance(startTime, minutes);
    return setTimeout(function(){
      return constructor.finishTimer(startTime);
    }, minutes * 1000 * 60);
  };
  constructor.finishTimer = function(startTime){
    var key, ref$, ref1$;
    console.log('finishTimer');
    key = startTime.getTime();
    Notification.show('timer.png', 'time up!', constructor.timerInstances[key].minutes + ' min');
    return ref1$ = (ref$ = constructor.timerInstances)[key], delete ref$[key], ref1$;
  };
  constructor.listTimer = function(){
    var list, s, t;
    console.log('listTimer');
    console.log(constructor.timerInstances);
    list = (function(){
      var ref$, results$ = [];
      for (s in ref$ = constructor.timerInstances) {
        t = ref$[s];
        results$.push(t.minutes + ' min');
      }
      return results$;
    }()).join(", ");
    console.log(list);
    return Notification.show('timer.png', 'timer list', list);
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
  constructor.showHtml = function(icon, title, text, shownSeconds){
    var n;
    if (window.webkitNotifications) {
      console.log("Notifications are supported!");
      if (webkitNotifications.checkPermission() === 0) {
        n = webkitNotifications.createHTMLNotification("notification.html");
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
  var q, m;
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
        q = msg.item.query;
        m = q.match(/\d+/);
        console.log(m);
        if (m != null && m[0] != null) {
          Timer.startTimer(parseInt(m[0]));
        } else {
          Timer.listTimer();
        }
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