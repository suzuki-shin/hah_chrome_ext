p = prelude

CTRL_KEYCODE = 17
ALT_KEYCODE = 18

ITEM_TYPE_OF = {tab: 'TAB', history: 'HIS', bookmark: 'BKM', websearch: 'WEB', command: 'COM'}
DEFAULT_SELECTOR_NUM = 20

FORM_INPUT_FIELDS = 'input[type="text"]:not("#selectorInput"), textarea, select'
# FORM_INPUT_FIELDS = 'input[type="text"], textarea, select'
CLICKABLES = 'a'
# CLICKABLES = "a[href],input:not([type=hidden]),textarea,select,*[onclick],button"

_HINT_KEYS = {65:'A', 66:'B', 67:'C', 68:'D', 69:'E', 70:'F', 71:'G', 72:'H', 73:'I', 74:'J', 75:'K', 76:'L', 77:'M', 78:'N', 79:'O', 80:'P', 81:'Q', 82:'R', 83:'S', 84:'T', 85:'U', 86:'V', 87:'W', 88:'X', 89:'Y', 90:'Z'}
HINT_KEYS = {}
for k1, v1 of _HINT_KEYS
  for k2, v2 of _HINT_KEYS
    HINT_KEYS[parseInt(k1) * 100 + parseInt(k2)] = v1 + v2

# 打ったHintKeyの一打目と二打目のキーコードをうけとり、それに対応するクリック要素のインデックスを返す
# keyCodeToIndex :: Int -> Int -> Int
keyCodeToIndex = (firstKeyCode, secondKeyCode) ->
  $.inArray(parseInt(firstKeyCode) * 100 + parseInt(secondKeyCode), [parseInt(k) for k,v of HINT_KEYS])

# インデックスを受取り、HintKeyのリストの中から対応するキーコードを返す
# indexToKeyCode :: Int -> String
indexToKeyCode = (index) -> [k for k,v of HINT_KEYS][index]

# キーコードを受取り、それがHintKeyかどうかを返す
# isHitAHintKey :: Int -> Bool
isHitAHintKey = (keyCode) ->
  $.inArray(String(keyCode), [k for k,v of _HINT_KEYS]) isnt -1

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

Main.start = (keyMapper, makeSelectorConsole) ->
  Main.ctrl = off
  Main.alt = off
  Main.mode = NeutralMode

  $(document).keyup((e) -> Main.mode.keyupMap(e, keyMapper, makeSelectorConsole))
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

  $('body').on('focus', FORM_INPUT_FIELDS, (->
    log('form focus')
    Main.mode = FormFocusMode
  ))
  $('body').on('blur', FORM_INPUT_FIELDS, (->
    log('form blur')
    Main.mode = NeutralMode
  ))

# 何のモードでもない状態を表すモードのクラス
class NeutralMode
  @keydownMap = (e, keyMapper) ->
    log('mode: ' + Main.mode)
    log('keyCode: ' + e.keyCode)
    log('Ctrl: ' + Main.ctrl)
    log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

    if e.keyCode is CTRL_KEYCODE
      Main.ctrl = on
      return

    switch keyMapper(e.keyCode, Main.ctrl, Main.alt)
    case 'START_HITAHINT'  then @@startHah()
    case 'FOCUS_FORM'      then @@focusForm(e)
    case 'TOGGLE_SELECTOR' then @@toggleSelector()
    case 'CANCEL'          then @@cancel(e)
#     case KEY_CODE.BACK_HISTORY    then @@backHistory()
    default (-> log('default'))
#     e.preventDefault()

  @keyupMap = (e, keyMapper, makeSelectorConsole) ->
    log('mode: ' + Main.mode)
    log('keyCode: ' + e.keyCode)
    log('Ctrl: ' + Main.ctrl)
    log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

    if e.keyCode is CTRL_KEYCODE
      Main.ctrl = off
      return

  @@backHistory =->
    history.back()

  @@toggleSelector =->
    Main.mode = SelectorMode
    $('#selectorConsole').show()
    $('#selectorInput').focus()

  @@focusForm = (e) ->
    e.preventDefault()
    Main.mode = FormFocusMode
    Main.formInputFieldIndex = 0
    $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus()

  @@startHah =->
    Main.mode = HitAHintMode
    $(CLICKABLES).addClass('links').html((i, oldHtml) ->
      if HINT_KEYS[indexToKeyCode(i)]?
      then '<div class="hintKey">' + HINT_KEYS[indexToKeyCode(i)] + '</div> ' + oldHtml
      else oldHtml)

  @@cancel = (e) ->
    e.preventDefault()
    Main.mode = NeutralMode
    $('#selectorConsole').hide()
    $(':focus').blur()
    HitAHintMode.firstKeyCode = null
    $(CLICKABLES).removeClass('links')
    $('.hintKey').remove()

class SelectorMode
  @keydownMap = (e, keyMapper) ->
    log('mode: ' + Main.mode)
    log('keyCode: ' + e.keyCode)
    log('Ctrl: ' + Main.ctrl)
    log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

    if e.keyCode is CTRL_KEYCODE
      Main.ctrl = on
      return

    switch keyMapper(e.keyCode, Main.ctrl, Main.alt)
    case 'MOVE_NEXT_SELECTOR_CURSOR' then @@moveNextCursor(e)
    case 'MOVE_PREV_SELECTOR_CURSOR' then @@movePrevCursor(e)
    case 'CANCEL'                    then @@cancel(e)
    default (-> alert(e.keyCode))

  @keyupMap = (e, keyMapper, makeSelectorConsole) ->
    log('mode: ' + Main.mode)
    log('keyCode: ' + e.keyCode)
    log('Ctrl: ' + Main.ctrl)
    log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

    if e.keyCode is CTRL_KEYCODE
      Main.ctrl = off
      return

    @@filterSelector(e, makeSelectorConsole)

  @@cancel = (e) ->
    e.preventDefault()
    Main.mode = NeutralMode
    $('#selectorConsole').hide()
    $(':focus').blur()

  @filterSelector = (e, makeSelectorConsole) ->
    log('filterSelector1')
    if e.keyCode < 48 or e.keyCode > 90
      return
    log('filterSelector2')

    # 受け取ったテキストをスペース区切りで分割して、その要素すべてが(tab|history|bookmark)のtitleかtabのurlに含まれるtabのみ返す
    # filtering :: String -> [{title, url, type}] -> [{title, url, type}]
    filtering = (text, list) ->
      # queriesのすべての要素がtitleかurlに見つかるかどうかを返す
      # titleAndUrlMatch :: Elem -> [String] -> Bool
      matchP = (elem, queries) ->
        p.all(p.id, [elem.title.toLowerCase().search(q) isnt -1 or
                     elem.url.toLowerCase().search(q) isnt -1 or
                     ITEM_TYPE_OF[elem.type].toLowerCase().search(q) isnt -1 for q in queries])
      p.filter(((t) -> matchP(t, text.toLowerCase().split(' '))), list)

    log('filterSelector')
    text = $('#selectorInput').val()
    makeSelectorConsole(filtering(text, Main.list).concat(searchList))
    $('#selectorConsole').show()

  @@toggleSelector = (e) ->
    e.preventDefault()
    Main.mode = NeutralMode
    $('#selectorConsole').hide()

  @@moveNextCursor = (e) ->
    e.preventDefault()
    log('moveNextCursor')
    x = $('#selectorList .selected').removeClass("selected").next("tr").addClass("selected")
    if x.length is 0 then $('#selectorList tr').first().addClass("selected")

  @@movePrevCursor = (e) ->
    e.preventDefault()
    log('movePrevCursor')
    x = $('#selectorList .selected').removeClass("selected").prev("tr").addClass("selected")
    if x.length is 0 then $('#selectorList tr').last().addClass("selected")

  @@decideSelector = (e, makeSelectorConsole) ->
    e.preventDefault()
    log('decideSelector')
    [type, id] = $('#selectorList tr.selected').attr('id').split('-')
    url = $('#selectorList tr.selected span.url').text()
    query = $('#selectorInput').val()
    @@cancel(e)
    chrome.extension.sendMessage(
      {mes: "decideSelector", item:{id: id, url: url, type: type, query: query}},
      ((list) ->
        Main.list = list
        makeSelectorConsole(list)
      ))
    $('#selectorInput').val('')
    false


class HitAHintMode
  @keydownMap = (e, keyMapper) ->
    log('mode: ' + Main.mode)
    log('keyCode: ' + e.keyCode)
    log('Ctrl: ' + Main.ctrl)
    log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

    if e.keyCode is CTRL_KEYCODE
      Main.ctrl = on
      return

    switch keyMapper(e.keyCode, Main.ctrl, Main.alt)
    case 'CANCEL' then @@cancel(e)
    default
      if isHitAHintKey(e.keyCode) then @@hitHitKey(e)

  @keyupMap = (e, keyMapper, makeSelectorConsole) ->
    log('mode: ' + Main.mode)
    log('keyCode: ' + e.keyCode)
    log('Ctrl: ' + Main.ctrl)
    log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

    if e.keyCode is CTRL_KEYCODE
      Main.ctrl = off
      return

  @firstKeyCode = null

  @@cancel = (e) ->
    @@firstKeyCode = null
    e.preventDefault()
    Main.mode = NeutralMode
    $(CLICKABLES).removeClass('links')
    $('.hintKey').remove()

  @@hitHitKey = (e) ->
    e.preventDefault()
    log('hit!: ' + e.keyCode + ', 1stkey: ' + @firstKeyCode)

    if @firstKeyCode is null
      @firstKeyCode = e.keyCode
    else
      idx = keyCodeToIndex(@firstKeyCode,  e.keyCode)
      log('idx: ' + idx)
      try
        $(CLICKABLES)[idx].click()
        Main.mode = NeutralMode
        $(CLICKABLES).removeClass('links')
        $('.hintKey').remove()
        @firstKeyCode = null
      catch
        @firstKeyCode = e.keyCode


class FormFocusMode
  @keydownMap = (e, keyMapper) ->
    log('mode: ' + Main.mode)
    log('keyCode: ' + e.keyCode)
    log('Ctrl: ' + Main.ctrl)
    log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

    if e.keyCode is CTRL_KEYCODE
      Main.ctrl = on
      return
    log('keydownMap')

  @keyupMap = (e, keyMapper, makeSelectorConsole) ->
    log('mode: ' + Main.mode)
    log('keyCode: ' + e.keyCode)
    log('Ctrl: ' + Main.ctrl)
    log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

    if e.keyCode is CTRL_KEYCODE
      Main.ctrl = off
      return

    switch keyMapper(e.keyCode, Main.ctrl, Main.alt)
    case 'MOVE_NEXT_FORM' then @@focusNextForm(e)
    case 'MOVE_PREV_FORM' then @@focusPrevForm(e)
    case 'CANCEL'         then @@cancel(e)
    default (-> log('default'))

  @focusNextForm = (e) ->
    e.preventDefault()
    log('focusNextForm')
    Main.formInputFieldIndex += 1
    log(Main.formInputFieldIndex)
    log($(FORM_INPUT_FIELDS))
    log($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex))
    if $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex)?
      $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus()

  @focusPrevForm = (e) ->
    e.preventDefault()
    log('focusPrevForm')
    Main.formInputFieldIndex -= 1
    log(Main.formInputFieldIndex)
    log($(FORM_INPUT_FIELDS))
    log($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex))
    if $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex)?
      $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus()

  @@cancel = (e) ->
    e.preventDefault()
    Main.mode = NeutralMode
    $(':focus').blur()

chrome.storage.sync.get('settings', ((d) ->
  log(d)
  keyMapper = (keyCode, ctrl, alt) ->
    KEY = DEFAULT_SETTINGS
    if d.settings.key then KEY <<< d.settings.key
    log(KEY)
    p.first([k for k, v of KEY when v.CODE == keyCode and v.CTRL == ctrl and v.ALT == alt])


  selector_num = d.settings?.selector?.NUM ? DEFAULT_SELECTOR_NUM
  log(selector_num)

  searchList = p.filter(((l) -> l.url? and l.url isnt ''), d.settings.search_list ? COMMAND_LIST)

  # (tab|history|bookmark|,,,)のリストをうけとりそれをhtmlにしてappendする
  # makeSelectorConsole :: [{title, url, type}] -> IO Jquery
  makeSelectorConsole = (list) ->
    if $('#selectorList') then $('#selectorList').remove()
    log(list)
    ts = p.concat(
      p.take(selector_num,
             ['<tr id="' + t.type + '-' + t.id + '"><td><span class="title">['+ ITEM_TYPE_OF[t.type] + '] ' + t.title + ' </span><span class="url"> ' + t.url + '</span></td></tr>' for t in list]))
    $('#selectorConsole').append('<table id="selectorList">' + ts + '</table>')
    $('#selectorList tr:first').addClass("selected")


  Main.start(keyMapper, makeSelectorConsole)
))