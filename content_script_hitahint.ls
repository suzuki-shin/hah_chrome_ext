p = prelude

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


class HitAHintMode
  @keyupMap = (e) ->
    switch e.keyCode
    case KEY_CODE.CANCEL then @@keyUpCancel()
    default @@keyUpHintKey(e.keyCode)
    e.preventDefault()

  @keydownMap = (e) ->
    console.log('keydownMap')

  @firstKeyCode = null

  @keyUpCancel =->
    Main.mode = NeutralMode
    $(CLICKABLES).removeClass('links')
    $('.hintKey').remove()
    @@firstKeyCode = null

  @keyUpHintKey = (keyCode) ->
    console.log('hit!: ' + keyCode + ', 1stkey: ' + @firstKeyCode)
    return if not isHitAHintKey(keyCode)

    if @firstKeyCode is null
      @firstKeyCode = keyCode
    else
      idx = keyCodeToIndex(@firstKeyCode,  keyCode)
      $(CLICKABLES)[idx].click()
      Main.mode = NeutralMode
      $(CLICKABLES).removeClass('links')
      $('.hintKey').remove()
      @firstKeyCode = null


class FormFocusMode
  @keyupMap = (e) ->
    switch e.keyCode
    case KEY_CODE.MOVE_NEXT_FORM then @@keyUpFormNext()
    case KEY_CODE.MOVE_PREV_FORM then @@keyUpFormPrev()
    case KEY_CODE.CANCEL         then @@keyUpCancel()
    default (-> console.log('default'))
    e.preventDefault()

  @keydownMap = (e) ->
    console.log('keydownMap')

  @keyUpFormNext =->
    console.log('keyUpFormNext')
    Main.formInputFieldIndex += 1
    console.log(Main.formInputFieldIndex)
    console.log($(FORM_INPUT_FIELDS))
    console.log($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex))
    if $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex)?
      $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus()

  @keyUpFormPrev =->
    console.log('keyUpFormPrev')
    Main.formInputFieldIndex -= 1
    console.log(Main.formInputFieldIndex)
    console.log($(FORM_INPUT_FIELDS))
    console.log($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex))
    if $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex)?
      $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus()

  @keyUpCancel =->
    Main.mode = NeutralMode
    $(':focus').blur()


NeutralMode.keyUpFocusForm =->
  Main.mode = FormFocusMode
  Main.formInputFieldIndex = 0
  $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus()

NeutralMode.keyUpHitAHintStart =->
  Main.mode = HitAHintMode
  $(CLICKABLES).addClass('links').html((i, oldHtml) ->
    if HINT_KEYS[indexToKeyCode(i)]?
    then '<div class="hintKey">' + HINT_KEYS[indexToKeyCode(i)] + '</div> ' + oldHtml
    else oldHtml)

class HitAHint
  @@start =->
    if isFocusingForm() then Main.mode = FormFocusMode

    $('body').on('focus', FORM_INPUT_FIELDS, (->
      console.log('form focus')
      Main.mode = FormFocusMode
    ))
    $('body').on('blur', FORM_INPUT_FIELDS, (->
      console.log('form blur')
      Main.mode = NeutralMode
    ))

HitAHint.start()
