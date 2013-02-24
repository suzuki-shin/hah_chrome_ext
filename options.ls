AVAILABLE_KEYCODES = [parseInt(k) for k, v of KEYMAP when k >= 27]

restoreSettings =->
#   d = {}
#   try
#     d.settings = JSON.parse(localStorage['settings'] || '{}')
#   catch
#     d.settings = DEFAULT_SETTINGS

  chrome.storage.sync('settings', ((d) ->
    hitahint_start_code   = if d.settings? and d.settings.START_HITAHINT? then d.settings.START_HITAHINT.CODE else DEFAULT_SETTINGS.START_HITAHINT.CODE
    hitahint_start_ctrl   = if d.settings? and d.settings.START_HITAHINT? then d.settings.START_HITAHINT.CTRL else DEFAULT_SETTINGS.START_HITAHINT.CTRL
    hitahint_start_alt    = if d.settings? and d.settings.START_HITAHINT? then d.settings.START_HITAHINT.ALT  else DEFAULT_SETTINGS.START_HITAHINT.ALT
    tab_select_start_code = if d.settings? and d.settings.TOGGLE_SELECTOR? then d.settings.TOGGLE_SELECTOR.CODE else DEFAULT_SETTINGS.TOGGLE_SELECTOR.CODE
    tab_select_start_ctrl = if d.settings? and d.settings.TOGGLE_SELECTOR? then d.settings.TOGGLE_SELECTOR.CTRL else DEFAULT_SETTINGS.TOGGLE_SELECTOR.CTRL
    tab_select_start_alt  = if d.settings? and d.settings.TOGGLE_SELECTOR? then d.settings.TOGGLE_SELECTOR.ALT  else DEFAULT_SETTINGS.TOGGLE_SELECTOR.ALT
    cancel_code           = if d.settings? and d.settings.CANCEL then d.settings.CANCEL.CODE else DEFAULT_SETTINGS.CANCEL.CODE
    cancel_ctrl           = if d.settings? and d.settings.CANCEL then d.settings.CANCEL.CTRL else DEFAULT_SETTINGS.CANCEL.CTRL
    cancel_alt            = if d.settings? and d.settings.CANCEL then d.settings.CANCEL.ALT  else DEFAULT_SETTINGS.CANCEL.ALT

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
  ))

saveSettings =->
  console.log('saveSettings')

  settings =
    'START_HITAHINT':
      CODE: parseInt($('#hitahint_start_code').val()) ? DEFAULT_SETTINGS.START_HITAHINT.CODE
      CTRL: $('#hitahint_start_ctrl').is(':checked')  ? DEFAULT_SETTINGS.START_HITAHINT.CTRL
      ALT:  $('#hitahint_start_alt').is(':checked')   ? DEFAULT_SETTINGS.START_HITAHINT.ALT
    'TOGGLE_SELECTOR':
      CODE: parseInt($('#tab_select_start_code').val()) ? DEFAULT_SETTINGS.TOGGLE_SELECTOR.CODE
      CTRL: $('#tab_select_start_ctrl').is(':checked')  ? DEFAULT_SETTINGS.TOGGLE_SELECTOR.CTRL
      ALT:  $('#tab_select_start_alt').is(':checked')   ? DEFAULT_SETTINGS.TOGGLE_SELECTOR.ALT
    'CANCEL':
      CODE: parseInt($('#cancel_code').val()) ? DEFAULT_SETTINGS.CANCEL.CODE
      CTRL: $('#cancel_ctrl').is(':checked')  ?  DEFAULT_SETTINGS.CANCEL.CTRL
      ALT:  $('#cancel_alt').is(':checked')   ? DEFAULT_SETTINGS.CANCEL.ALT

  console.log(settings)
#   localStorage['settings'] = JSON.stringify(settings)

  chrome.storage.sync.set({'settings': settings})

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