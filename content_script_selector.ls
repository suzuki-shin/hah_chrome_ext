p = prelude

ITEM_TYPE_OF = {tab: 'TAB', history: 'HIS', bookmark: 'BKM', websearch: 'WEB', command: 'COM'}
SELECTOR_NUM = 20

WEB_SEARCH_LIST =
  {title: 'google検索', url: 'https://www.google.co.jp/#hl=ja&q=', type: 'websearch'}
  {title: 'alc辞書', url: 'http://eow.alc.co.jp/search?ref=sa&q=', type: 'websearch'}

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


class SelectorMode
  @keyupMap = (e) ->
    switch e.keyCode
    case KEY_CODE.CANCEL          then @@keyUpCancel()
    case KEY_CODE.TOGGLE_SELECTOR then @@keyUpSelectorToggle()
    default @@keyUpSelectorFiltering(e)
    e.preventDefault()

  @keydownMap = (e) ->
    switch e.keyCode
    case KEY_CODE.MOVE_NEXT_SELECTOR_CURSOR then @@keyDownSelectorCursorNext(e)
    case KEY_CODE.MOVE_PREV_SELECTOR_CURSOR then @@keyDownSelectorCursorPrev(e)
    default (-> alert(e.keyCode))

  @keyUpCancel =->
    Main.mode = NeutralMode
    $('#selectorConsole').hide()
    $(':focus').blur()

  @keyUpSelectorFiltering = (e) ->
    return false if e.keyCode < 65 or e.keyCode > 90

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

  @keyUpSelectorToggle =->
    Main.mode = NeutralMode
    $('#selectorConsole').hide()

  @keyDownSelectorCursorNext = (e) ->
    console.log('keyDownSelectorCursorNext')
    $('#selectorList .selected').removeClass("selected").next("tr").addClass("selected")
    e.preventDefault()

  @keyDownSelectorCursorPrev = (e) ->
    console.log('keyDownSelectorCursorPrev')
    $('#selectorList .selected').removeClass("selected").prev("tr").addClass("selected")
    e.preventDefault()

  @keyUpSelectorDecide =->
    console.log('keyUpSelectorDecide')
    [type, id] = $('#selectorList tr.selected').attr('id').split('-')
    url = $('#selectorList tr.selected span.url').text()
    query = $('#selectorInput').val()
    @@keyUpCancel()
    chrome.extension.sendMessage(
      {mes: "keyUpSelectorDecide", item:{id: id, url: url, type: type, query: query}},
      ((list) -> Main.list = list))
    $('#selectorInput').val('')
    false

NeutralMode.keyUpSelectorToggle =->
  Main.mode = SelectorMode
  $('#selectorConsole').show()
  $('#selectorInput').focus()

class Selector
  @@start =->
    chrome.extension.sendMessage({mes: "makeSelectorConsole"}, ((list) ->
      console.log('extension.sendMessage')
      console.log(list)
      Main.list = list
      $('body').append('<div id="selectorConsole"><form id="selectorForm"><input id="selectorInput" type="text" /></form></div>')
      makeSelectorConsole(list)
    ))

    $('body').on('submit', '#selectorForm', SelectorMode.keyUpSelectorDecide)

Selector.start()