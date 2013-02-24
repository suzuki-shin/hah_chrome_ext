p = prelude

CTRL_KEYCODE = 17
ALT_KEYCODE = 18

ITEM_TYPE_OF = {tab: 'TAB', history: 'HIS', bookmark: 'BKM', websearch: 'WEB', command: 'COM'}
SELECTOR_NUM = 20

WEB_SEARCH_LIST =
  {title: 'google検索', url: 'https://www.google.co.jp/#hl=ja&q=', type: 'websearch'}
  {title: 'alc辞書', url: 'http://eow.alc.co.jp/search?ref=sa&q=', type: 'websearch'}


KEY = DEFAULT_SETTINGS
chrome.storage.sync.get('settings', ((d) ->
  console.log(d)
  if d.settings? then KEY <<< d.settings
  console.log(KEY)

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
    console.log('isFocusingForm')
    focusElems = $(':focus')
    console.log(focusElems.attr('type'))
    focusElems[0] and (
      (focusElems[0].nodeName.toLowerCase() == "input" and focusElems.attr('type') == "text") or
      focusElems[0].nodeName.toLowerCase() == "textarea"
    )

  keyMapper = (keyCode, ctrl, alt) ->
    p.first([k for k, v of KEY when v.CODE == keyCode and v.CTRL == ctrl and v.ALT == alt])


  # (tab|history|bookmark|,,,)のリストをうけとりそれをhtmlにしてappendする
  # makeSelectorConsole :: [{title, url, type}] -> IO Jquery
  makeSelectorConsole = (list) ->
    if $('#selectorList') then $('#selectorList').remove()
    console.log(list)
    ts = p.concat(
      p.take(SELECTOR_NUM,
             ['<tr id="' + t.type + '-' + t.id + '"><td><span class="title">['+ ITEM_TYPE_OF[t.type] + '] ' + t.title + ' </span><span class="url"> ' + t.url + '</span></td></tr>' for t in list]))
    $('#selectorConsole').append('<table id="selectorList">' + ts + '</table>')
    $('#selectorList tr:first').addClass("selected")


  class Main

  # 何のモードでもない状態を表すモードのクラス
  class NeutralMode
    @keydownMap = (e) ->
      console.log('mode: ' + Main.mode)
      console.log('keyCode: ' + e.keyCode)
      console.log('Ctrl: ' + Main.ctrl)
      console.log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

      if e.keyCode is CTRL_KEYCODE
        Main.ctrl = on
        return

      switch keyMapper(e.keyCode, Main.ctrl, Main.alt)
      case 'START_HITAHINT'  then @@keyUpHitAHintStart()
      case 'FOCUS_FORM'      then @@keyUpFocusForm()
      case 'TOGGLE_SELECTOR' then @@keyUpSelectorToggle()
  #     case KEY_CODE.BACK_HISTORY    then @@keyUpHistoryBack()
      default (-> console.log('default'))
  #     e.preventDefault()

    @keyupMap = (e) ->
      console.log('mode: ' + Main.mode)
      console.log('keyCode: ' + e.keyCode)
      console.log('Ctrl: ' + Main.ctrl)
      console.log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

      if e.keyCode is CTRL_KEYCODE
        Main.ctrl = off
        return

    @keyUpHistoryBack =->
      history.back()

    @@keyUpSelectorToggle =->
      Main.mode = SelectorMode
      $('#selectorConsole').show()
      $('#selectorInput').focus()

    @@keyUpFocusForm =->
      Main.mode = FormFocusMode
      Main.formInputFieldIndex = 0
      $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus()

    @@keyUpHitAHintStart =->
      Main.mode = HitAHintMode
      $(CLICKABLES).addClass('links').html((i, oldHtml) ->
        if HINT_KEYS[indexToKeyCode(i)]?
        then '<div class="hintKey">' + HINT_KEYS[indexToKeyCode(i)] + '</div> ' + oldHtml
        else oldHtml)


  Main.start =->
    Main.ctrl = off
    Main.alt = off
    Main.mode = NeutralMode

    $(document).keyup((e) -> Main.mode.keyupMap(e))
    $(document).keydown((e) -> Main.mode.keydownMap(e))

    chrome.extension.sendMessage({mes: "makeSelectorConsole"}, ((list) ->
      console.log('extension.sendMessage')
      console.log(list)
      Main.list = list
      $('body').append('<div id="selectorConsole"><form id="selectorForm"><input id="selectorInput" type="text" /></form></div>')
      makeSelectorConsole(list)
    ))

    $('body').on('submit', '#selectorForm', (e) -> SelectorMode.keyUpSelectorDecide(e))

    if isFocusingForm() then Main.mode = FormFocusMode

    $('body').on('focus', FORM_INPUT_FIELDS, (->
      console.log('form focus')
      Main.mode = FormFocusMode
    ))
    $('body').on('blur', FORM_INPUT_FIELDS, (->
      console.log('form blur')
      Main.mode = NeutralMode
    ))

  class SelectorMode
    @keydownMap = (e) ->
      console.log('mode: ' + Main.mode)
      console.log('keyCode: ' + e.keyCode)
      console.log('Ctrl: ' + Main.ctrl)
      console.log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

      if e.keyCode is CTRL_KEYCODE
        Main.ctrl = on
        return

      switch keyMapper(e.keyCode, Main.ctrl, Main.alt)
      case 'MOVE_NEXT_SELECTOR_CURSOR' then @@keyDownSelectorCursorNext(e)
      case 'MOVE_PREV_SELECTOR_CURSOR' then @@keyDownSelectorCursorPrev(e)
      case 'CANCEL'                    then @@keyUpCancel(e)
      default (-> alert(e.keyCode))

    @keyupMap = (e) ->
      console.log('mode: ' + Main.mode)
      console.log('keyCode: ' + e.keyCode)
      console.log('Ctrl: ' + Main.ctrl)
      console.log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

      if e.keyCode is CTRL_KEYCODE
        Main.ctrl = off
        return

      @@keyUpSelectorFiltering(e)

    @keyUpCancel = (e) ->
      e.preventDefault()
      Main.mode = NeutralMode
      $('#selectorConsole').hide()
      $(':focus').blur()

    @keyUpSelectorFiltering = (e) ->
      console.log('keyUpSelectorFiltering1')
      if e.keyCode < 65 or e.keyCode > 90
        return
      console.log('keyUpSelectorFiltering2')

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

      console.log('keyUpSelectorFiltering')
      text = $('#selectorInput').val()
      makeSelectorConsole(filtering(text, Main.list).concat(WEB_SEARCH_LIST))
      $('#selectorConsole').show()

    @keyUpSelectorToggle = (e) ->
      e.preventDefault()
      Main.mode = NeutralMode
      $('#selectorConsole').hide()

    @keyDownSelectorCursorNext = (e) ->
      e.preventDefault()
      console.log('keyDownSelectorCursorNext')
      $('#selectorList .selected').removeClass("selected").next("tr").addClass("selected")

    @keyDownSelectorCursorPrev = (e) ->
      e.preventDefault()
      console.log('keyDownSelectorCursorPrev')
      $('#selectorList .selected').removeClass("selected").prev("tr").addClass("selected")

    @keyUpSelectorDecide = (e) ->
      console.log('keyUpSelectorDecide')
      e.preventDefault()
      console.log('keyUpSelectorDecide')
      [type, id] = $('#selectorList tr.selected').attr('id').split('-')
      url = $('#selectorList tr.selected span.url').text()
      query = $('#selectorInput').val()
      @@keyUpCancel(e)
      chrome.extension.sendMessage(
        {mes: "keyUpSelectorDecide", item:{id: id, url: url, type: type, query: query}},
        ((list) -> Main.list = list))
      $('#selectorInput').val('')
      false


  class HitAHintMode
    @keydownMap = (e) ->
      console.log('mode: ' + Main.mode)
      console.log('keyCode: ' + e.keyCode)
      console.log('Ctrl: ' + Main.ctrl)
      console.log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

      if e.keyCode is CTRL_KEYCODE
        Main.ctrl = on
        return

      switch keyMapper(e.keyCode, Main.ctrl, Main.alt)
      case 'CANCEL' then @@keyUpCancel(e)

      if isHitAHintKey(e.keyCode) then @@keyUpHintKey(e)

    @keyupMap = (e) ->
      console.log('mode: ' + Main.mode)
      console.log('keyCode: ' + e.keyCode)
      console.log('Ctrl: ' + Main.ctrl)
      console.log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

      if e.keyCode is CTRL_KEYCODE
        Main.ctrl = off
        return

    @firstKeyCode = null

    @keyUpCancel = (e) ->
      @@firstKeyCode = null
      e.preventDefault()
      Main.mode = NeutralMode
      $(CLICKABLES).removeClass('links')
      $('.hintKey').remove()

    @keyUpHintKey = (e) ->
      e.preventDefault()
      console.log('hit!: ' + e.keyCode + ', 1stkey: ' + @firstKeyCode)

      if @firstKeyCode is null
        @firstKeyCode = e.keyCode
      else
        idx = keyCodeToIndex(@firstKeyCode,  e.keyCode)
        console.log('idx: ' + idx)
        $(CLICKABLES)[idx].click()
        Main.mode = NeutralMode
        $(CLICKABLES).removeClass('links')
        $('.hintKey').remove()
        @firstKeyCode = null


  class FormFocusMode
    @keydownMap = (e) ->
      console.log('mode: ' + Main.mode)
      console.log('keyCode: ' + e.keyCode)
      console.log('Ctrl: ' + Main.ctrl)
      console.log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

      if e.keyCode is CTRL_KEYCODE
        Main.ctrl = on
        return
      console.log('keydownMap')

    @keyupMap = (e) ->
      console.log('mode: ' + Main.mode)
      console.log('keyCode: ' + e.keyCode)
      console.log('Ctrl: ' + Main.ctrl)
      console.log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

      if e.keyCode is CTRL_KEYCODE
        Main.ctrl = off
        return

      switch keyMapper(e.keyCode, Main.ctrl, Main.alt)
      case 'MOVE_NEXT_FORM' then @@keyUpFormNext(e)
      case 'MOVE_PREV_FORM' then @@keyUpFormPrev(e)
      case 'CANCEL'         then @@keyUpCancel(e)
      default (-> console.log('default'))

    @keyUpFormNext = (e) ->
      e.preventDefault()
      console.log('keyUpFormNext')
      Main.formInputFieldIndex += 1
      console.log(Main.formInputFieldIndex)
      console.log($(FORM_INPUT_FIELDS))
      console.log($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex))
      if $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex)?
        $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus()

    @keyUpFormPrev = (e) ->
      e.preventDefault()
      console.log('keyUpFormPrev')
      Main.formInputFieldIndex -= 1
      console.log(Main.formInputFieldIndex)
      console.log($(FORM_INPUT_FIELDS))
      console.log($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex))
      if $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex)?
        $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus()

    @keyUpCancel = (e) ->
      e.preventDefault()
      Main.mode = NeutralMode
      $(':focus').blur()

  Main.start()
))