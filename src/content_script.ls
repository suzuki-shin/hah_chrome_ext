ITEM_TYPE_OF = {tab: 'TAB', history: 'HIS', bookmark: 'BKM', websearch: 'WEB', command: 'COM'}
DEFAULT_SELECTOR_NUM = 20


# 現在フォーカスがある要素がtextタイプのinputかtextareaである(文字入力可能なformの要素)かどうかを返す
# isFocusingForm :: Bool
isFocusingForm =->
  log('isFocusingForm')
  focusElems = $(':focus')
  log(focusElems.attr('type'))
  focusElems[0] and (
    (focusElems[0].nodeName.toLowerCase() == "input" and focusElems.attr('type') == "text") or
    focusElems[0].nodeName.toLowerCase() == "textarea"
  )

class Main
  @@changeModKey = (status, keyCode) ->
    CTRL_KEYCODE  = 17
    ALT_KEYCODE   = 18
    SHIFT_KEYCODE = 16

    modKeys =
      CTRL_KEYCODE
      ALT_KEYCODE
      SHIFT_KEYCODE

    if not (keyCode in modKeys)
      log('not in modKeys')
      return false

    if keyCode is CTRL_KEYCODE
      log('CTRL_KEYCODE')
      @@ctrl = status

    if keyCode is ALT_KEYCODE
      log('ALT_KEYCODE')
      @@alt = status

    if keyCode is SHIFT_KEYCODE
      log('SHIFT_KEYCODE')
      @@shift = status

    true


Main.start = (keyMapper, makeSelectorConsole, searchList) ->
  Main.ctrl  = off
  Main.alt   = off
  Main.shift = off
  Main.mode  = NeutralMode

  $(document).keyup((e) -> Main.mode.keyupMap(e, keyMapper, makeSelectorConsole, searchList))
  $(document).keydown((e) -> Main.mode.keydownMap(e, keyMapper))

  chrome.extension.sendMessage({mes: "makeSelectorConsole"}, ((list) ->
    log('extension.sendMessage')
    log(list)
    Main.list = list
    $('body').append('<div id="selectorConsole"><form id="selectorForm"><input id="selectorInput" type="text" /></form></div>')
    makeSelectorConsole(list)
  ))

  $('body').on('submit', '#selectorForm', (e) -> SelectorMode.decideSelector(e, makeSelectorConsole))

  if isFocusingForm() then Main.mode = FormFocusMode

  $('body').on('focus', FORM_INPUT_FIELDS, (-> Main.mode = FormFocusMode ))
  $('body').on('blur', FORM_INPUT_FIELDS, (-> Main.mode = NeutralMode ))

chrome.storage.sync.get('settings', ((d) ->
  log(d)

  keyMapper = (keyCode, ctrl, alt, shift) ->
    KEY = DEFAULT_SETTINGS
    if d.settings.key then KEY <<< d.settings.key
    log('keyMapper')
    log(KEY)
    p.first([k for k, v of KEY when v.CODE == keyCode and v.CTRL == ctrl and v.ALT == alt and v.SHIFT == shift])


  # (tab|history|bookmark|,,,)のリストをうけとりそれをhtmlにしてappendする
  # makeSelectorConsole :: [{title, url, type}] -> IO Jquery
  makeSelectorConsole = (list) ->
    log(list)
    if $('#selectorList') then $('#selectorList').remove()

    selector_num = d.settings?.selector?.NUM ? DEFAULT_SELECTOR_NUM
    log(selector_num)
    ts = p.concat(
      p.take(selector_num,
             ['<tr id="' + t.type + '-' + t.id + '"><td><span class="title">['+ ITEM_TYPE_OF[t.type] + '] ' + t.title + ' </span><span class="url"> ' + t.url + '</span></td></tr>' for t in list]))
    $('#selectorConsole').append('<table id="selectorList">' + ts + '</table>')
    $('#selectorList tr:first').addClass("selected")

  searchList = p.filter(((l) -> l.url? and l.url isnt ''), (d.settings.search_list ? COMMAND_LIST) +++ {title: 'timer', url: 'timer',  type: 'command'})


  Main.start(keyMapper, makeSelectorConsole, searchList)
))