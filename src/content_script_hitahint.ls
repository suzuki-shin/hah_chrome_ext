# CLICKABLES = 'a'
CLICKABLES = "a[href],input:not([type=hidden]),select,*[onclick],button"

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

class HitAHintMode
  @keydownMap = (e, keyMapper) ->
    log('mode: ' + Main.mode)
    log('keyCode: ' + e.keyCode)
    log('Ctrl: ' + Main.ctrl)
    log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

    return if Main.changeModKey(on, e.keyCode)

    switch keyMapper(e.keyCode, Main.ctrl, Main.alt)
    case 'CANCEL' then @@cancel(e)
    default
      if isHitAHintKey(e.keyCode) then @@hitHintKey(e)

  @keyupMap = (e, keyMapper, makeSelectorConsole, _) ->
    log('mode: ' + Main.mode)
    log('keyCode: ' + e.keyCode)
    log('Ctrl: ' + Main.ctrl)
    log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

    return if Main.changeModKey(off, e.keyCode)

  @firstKeyCode = null

  @@cancel = (e) ->
    @@firstKeyCode = null
    e.preventDefault()
    Main.mode = NeutralMode
    $(CLICKABLES).removeClass('links')
    $(CLICKABLES).removeClass('links_newtab')
    $('.hintKey').remove()

  @@hitHintKey = (e) ->
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
