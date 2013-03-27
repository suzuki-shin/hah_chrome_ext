FORM_INPUT_FIELDS = 'input[type="text"]:not("#selectorInput"), textarea, select'
# FORM_INPUT_FIELDS = 'input[type="text"], textarea, select'

class FormFocusMode
  @keydownMap = (e, keyMapper) ->
    log('mode: ' + Main.mode)
    log('keyCode: ' + e.keyCode)
    log('Ctrl: ' + Main.ctrl)
    log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

    return if Main.changeModKey(on, e.keyCode)
    log('keydownMap')

  @keyupMap = (e, keyMapper, makeSelectorConsole, _) ->
    log('mode: ' + Main.mode)
    log('keyCode: ' + e.keyCode)
    log('Ctrl: ' + Main.ctrl)
    log({CODE: e.keyCode, CTRL: Main.ctrl, ALT: Main.alt})

    return if Main.changeModKey(off, e.keyCode)

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
