ITEM_TYPE_OF = {tab: 'TAB', history: 'HIS', bookmark: 'BKM', websearch: 'WEB', command: 'COM'}

class SelectorMode
  @keydownMap = (e, keyMapper) ->
    log('mode: ' + Main.mode)
    log('keyCode: ' + e.keyCode)
    log('Ctrl: ' + Main.ctrl)
    log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt, SHIFT: Main.shift})

    return if Main.changeModKey(on, e.keyCode)

    switch keyMapper(e.keyCode, Main.ctrl, Main.alt, Main.shift)
    case 'MOVE_NEXT_SELECTOR_CURSOR' then @@moveNextCursor(e)
    case 'MOVE_PREV_SELECTOR_CURSOR' then @@movePrevCursor(e)
    case 'CANCEL'                    then @@cancel(e)
    default (-> alert(e.keyCode))

  @keyupMap = (e, keyMapper, makeSelectorConsole, searchList) ->
    log('mode: ' + Main.mode)
    log('keyCode: ' + e.keyCode)
    log('Ctrl: ' + Main.ctrl)
    log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt, SHIFT: Main.shift})

    return if Main.changeModKey(off, e.keyCode)

    @@filterSelector(e, makeSelectorConsole, searchList)

  @@cancel = (e) ->
    e.preventDefault()
    Main.mode = NeutralMode
    $('#selectorConsole').hide()
    $(':focus').blur()

  @filterSelector = (e, makeSelectorConsole, searchList) ->
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
