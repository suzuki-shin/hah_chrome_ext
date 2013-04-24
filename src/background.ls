class TimerInstance
  (startTime, minutes) ->
    @startTime = startTime
    @minutes = minutes
  startTime: undefined
  minutes: 0

class Timer
  @@timerInstances = []

  @@startTimerFor = (minutes) ->
    console.log(minutes)
    Notification.show('timer.png', 'timer start', minutes + ' min', 3)
    startTime = new Date()
    @@timerInstances[startTime.getTime()] = new TimerInstance(startTime, minutes)
    setTimeout((-> @@finishTimer(startTime)), minutes * 1000 * 60)

  @@startTimerTill = (time) ->
    console.log(time)
    Notification.show('timer.png', 'timer start', 'until ' + time, 3)
    startTime = new Date()
    month = parseInt(startTime.getMonth()) + 1
    _fTimeStr = startTime.getFullYear() + '/' + month + '/' + startTime.getDate() + ' ' + time
    console.log(_fTimeStr)
    finishTime = new Date(_fTimeStr)
    minutes = parseInt((finishTime.getTime() - startTime.getTime()) / (1000 * 60))
    @@timerInstances[startTime.getTime()] = new TimerInstance(startTime, minutes)
    setTimeout((-> @@finishTimer(startTime)), minutes * 1000 * 60)

  @@finishTimer = (startTime) ->
    console.log('finishTimer')
    key = startTime.getTime()
    Notification.show('timer.png', 'time up!', @@timerInstances[key].minutes + ' min')
    delete @@timerInstances[key]

  @@listTimer =->
    console.log('listTimer')
    console.log(@@timerInstances)
    list = [t.minutes + ' min' for s, t of @@timerInstances].join(", ")
    console.log(list)
    Notification.show('timer.png', 'timer list', list)

class Notification
  @@show = (icon, title, text, shownSeconds) ->
    if window.webkitNotifications
      console.log("Notifications are supported!")
      if webkitNotifications.checkPermission() is 0
        n = webkitNotifications.createNotification(icon, title, text)
        n.show()
        if shownSeconds then setTimeout((-> n.cancel()), shownSeconds * 1000)
        console.log('createNotification')
      else
        webkitNotifications.requestPermission()
        console.log('requestPermission')
    else
      console.log("Notifications are not supported for this Browser/OS version yet.")

  @@showHtml = (icon, title, text, shownSeconds) ->
    if window.webkitNotifications
      console.log("Notifications are supported!")
      if webkitNotifications.checkPermission() is 0
        n = webkitNotifications.createHTMLNotification("notification.html")
        n.show()
        if shownSeconds then setTimeout((-> n.cancel()), shownSeconds * 1000)
        console.log('createNotification')
      else
        webkitNotifications.requestPermission()
        console.log('requestPermission')
    else
      console.log("Notifications are not supported for this Browser/OS version yet.")



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
  else if msg.mes == "decideSelector"
    console.log(msg)
    switch msg.item.type
    case "tab"
      console.log('tabs.update')
      chrome.tabs.update(parseInt(msg.item.id), {active: true})
    case "websearch"
      console.log('web search')
      chrome.tabs.create({url: msg.item.url + msg.item.query})
    case "command"
      console.log("command")
      switch msg.item.url
      case "timer"
        console.log('timer')
        q = msg.item.query
#         m = q.match(/\d+/)
        m = q.split(' ')
        console.log(m)
        if m? and m[1]?
          t = m[1].match(/\d+\:\d+/)
          if t? and t[0]
            console.log(t)
            Timer.startTimerTill(t[0])
          else
            Timer.startTimerFor(parseInt(m[1]))
        else
          Timer.listTimer()
      default
        console.log('other command')
    default
      chrome.tabs.create({url: msg.item.url})
    select(sendResponse)
  true
)
