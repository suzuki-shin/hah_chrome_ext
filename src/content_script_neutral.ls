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

  @keyupMap = (e, keyMapper, makeSelectorConsole, _) ->
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
