AVAILABLE_KEYCODES = [parseInt(k) for k, v of KEYMAP when k >= 27]

DEFAULT_SETTINGS =
  'START_HITAHINT':            {CODE: 69,  CTRL: on,  ALT: off} # Ctrl+e
  'FOCUS_FORM':                {CODE: 70,  CTRL: on,  ALT: off} # Ctrl+f
  'TOGGLE_SELECTOR':           {CODE: 186, CTRL: on,  ALT: off} # Ctrl+;
  'CANCEL':                    {CODE: 71,  CTRL: on,  ALT: off} # Ctrl+g
  'MOVE_NEXT_SELECTOR_CURSOR': {CODE: 40,  CTRL: off, ALT: off} # down
  'MOVE_PREV_SELECTOR_CURSOR': {CODE: 38,  CTRL: off, ALT: off} # up
  'MOVE_NEXT_FORM':            {CODE: 34,  CTRL: off, ALT: off} # pageup
  'MOVE_PREV_FORM':            {CODE: 33,  CTRL: off, ALT: off} # pagedown
  'BACK_HISTORY':              {CODE: 72,  CTRL: on,  ALT: off} # Ctrl+h

restoreSettings =->
  _settings = localStorage.settings
  settings = if _settings then JSON.parse(_settings) else DEFAULT_SETTINGS
  console.log(settings)

  hitahint_start_code = if settings['START_HITAHINT'] then settings['START_HITAHINT'].CODE else DEFAULT_SETTINGS.START_HITAHINT.CODE
  hitahint_start_ctrl = if settings['START_HITAHINT'] then settings['START_HITAHINT'].CTRL else DEFAULT_SETTINGS.START_HITAHINT.CTRL
  hitahint_start_alt  = if settings['START_HITAHINT'] then settings['START_HITAHINT'].ALT  else DEFAULT_SETTINGS.START_HITAHINT.ALT

  tab_select_start_code = if settings['TOGGLE_SELECTOR'] then settings['TOGGLE_SELECTOR'].CODE else DEFAULT_SETTINGS.TOGGLE_SELECTOR.CODE
  tab_select_start_ctrl = if settings['TOGGLE_SELECTOR'] then settings['TOGGLE_SELECTOR'].CTRL else DEFAULT_SETTINGS.TOGGLE_SELECTOR.CTRL
  tab_select_start_alt  = if settings['TOGGLE_SELECTOR'] then settings['TOGGLE_SELECTOR'].ALT  else DEFAULT_SETTINGS.TOGGLE_SELECTOR.ALT

  cancel_code = if settings['CANCEL'] then settings['CANCEL'].CODE else DEFAULT_SETTINGS.CANCEL.CODE
  cancel_ctrl = if settings['CANCEL'] then settings['CANCEL'].CTRL else DEFAULT_SETTINGS.CANCEL.CTRL
  cancel_alt  = if settings['CANCEL'] then settings['CANCEL'].ALT  else DEFAULT_SETTINGS.CANCEL.ALT

  $('#hitahint_start').val(KEYMAP[hitahint_start_code])
  $('#hitahint_start_code').val(hitahint_start_code)
  $('#hitahint_start_ctrl').attr("checked", hitahint_start_ctrl)
  $('#hitahint_start_alt').attr("checked", hitahint_start_alt)

  $('#tab_select_start').val(KEYMAP[tab_select_start_code])
  $('#tab_select_start_code').val(tab_select_start_code)
  $('#tab_select_start_ctrl').attr("checked", tab_select_start_ctrl)
  $('#tab_select_start_alt').attr("checked", tab_select_start_alt)

  $('#cancel').val(KEYMAP[cancel_code])
  $('#cancel_code').val(cancel_code)
  $('#cancel_ctrl').attr("checked", cancel_ctrl)
  $('#cancel_alt').attr("checked", cancel_alt)


saveSettings =->
  console.log('saveSettings')
  settings =
    'START_HITAHINT':
      CODE: parseInt($('#hitahint_start_code').val())                || DEFAULT_SETTINGS.START_HITAHINT.CODE
      CTRL: $('#hitahint_start_ctrl').attr('checked') == 'checked'   || DEFAULT_SETTINGS.START_HITAHINT.CTRL
      ALT:  $('#hitahint_start_alt').attr('checked') == 'checked'    || DEFAULT_SETTINGS.START_HITAHINT.ALT
    'TOGGLE_SELECTOR':
      CODE: parseInt($('#tab_select_start_code').val())              || DEFAULT_SETTINGS.TOGGLE_SELECTOR.CODE
      CTRL: $('#tab_select_start_ctrl').attr('checked') == 'checked' || DEFAULT_SETTINGS.TOGGLE_SELECTOR.CTRL
      ALT:  $('#tab_select_start_alt').attr('checked') == 'checked'  || DEFAULT_SETTINGS.TOGGLE_SELECTOR.ALT
    'CANCEL':
      CODE: parseInt($('#cancel_code').val())                        || DEFAULT_SETTINGS.CANCEL.CODE
      CTRL: $('#cancel_ctrl').attr('checked') == 'checked'           || DEFAULT_SETTINGS.CANCEL.CTRL
      ALT:  $('#cancel_alt').attr('checked') == 'checked'            || DEFAULT_SETTINGS.CANCEL.ALT

  console.log(settings)
  localStorage.settings = JSON.stringify(settings)

$(->
  restoreSettings()
  $('#save_options').click(saveSettings)

  $(document).keydown((e) ->
    console.log( $(':focus').attr('id'))
    id = $(':focus').attr('id')
    return if not id

    switch id
    case 'hitahint_start', 'tab_select_start', 'cancel'
      if e.keyCode in AVAILABLE_KEYCODES
        e.preventDefault()
        keyName = KEYMAP[e.keyCode]
        console.log('keyName:' + keyName)
        $(':focus').val(keyName)
        $('#' + id + '_code').val(parseInt(e.keyCode))
      else
        console.log('else: ' + e.keyCode)
  )
)