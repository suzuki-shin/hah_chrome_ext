p = prelude

AVAILABLE_KEYCODES = [parseInt(k) for k, v of KEYMAP when k >= 27]

restoreSettings =->
  chrome.storage.sync.get('settings', ((d) ->
    console.log('sync.get')
    console.log(d)

    hitahint_start_code   = if d?.settings?.key?.START_HITAHINT? then d.settings.key.START_HITAHINT.CODE else DEFAULT_SETTINGS.START_HITAHINT.CODE
    hitahint_start_ctrl   = if d?.settings?.key?.START_HITAHINT? then d.settings.key.START_HITAHINT.CTRL else DEFAULT_SETTINGS.START_HITAHINT.CTRL
    hitahint_start_alt    = if d?.settings?.key?.START_HITAHINT? then d.settings.key.START_HITAHINT.ALT  else DEFAULT_SETTINGS.START_HITAHINT.ALT
    tab_select_start_code = if d?.settings?.key?.TOGGLE_SELECTOR? then d.settings.key.TOGGLE_SELECTOR.CODE else DEFAULT_SETTINGS.TOGGLE_SELECTOR.CODE
    tab_select_start_ctrl = if d?.settings?.key?.TOGGLE_SELECTOR? then d.settings.key.TOGGLE_SELECTOR.CTRL else DEFAULT_SETTINGS.TOGGLE_SELECTOR.CTRL
    tab_select_start_alt  = if d?.settings?.key?.TOGGLE_SELECTOR? then d.settings.key.TOGGLE_SELECTOR.ALT  else DEFAULT_SETTINGS.TOGGLE_SELECTOR.ALT
    form_focus_code = if d?.settings?.key?.FOCUS_FORM? then d.settings.key.FOCUS_FORM.CODE else DEFAULT_SETTINGS.FOCUS_FORM.CODE
    form_focus_ctrl = if d?.settings?.key?.FOCUS_FORM? then d.settings.key.FOCUS_FORM.CTRL else DEFAULT_SETTINGS.FOCUS_FORM.CTRL
    form_focus_alt  = if d?.settings?.key?.FOCUS_FORM? then d.settings.key.FOCUS_FORM.ALT  else DEFAULT_SETTINGS.FOCUS_FORM.ALT
    cancel_code           = if d?.settings?.key?.CANCEL? then d.settings.key.CANCEL.CODE else DEFAULT_SETTINGS.CANCEL.CODE
    cancel_ctrl           = if d?.settings?.key?.CANCEL? then d.settings.key.CANCEL.CTRL else DEFAULT_SETTINGS.CANCEL.CTRL
    cancel_alt            = if d?.settings?.key?.CANCEL? then d.settings.key.CANCEL.ALT  else DEFAULT_SETTINGS.CANCEL.ALT

    selector_num = if d?.settings?.selector?.NUM? then d.settings.selector.NUM else DEFAULT_SETTINGS.SELECTOR.NUM

    search_list = if d?.settings?.search_list? then d.settings.search_list else COMMAND_LIST

    $('#hitahint_start').val(KEYMAP[hitahint_start_code])
    $('#hitahint_start_code').val(hitahint_start_code)
    $('#hitahint_start_ctrl').attr("checked", hitahint_start_ctrl)
    $('#hitahint_start_alt').attr("checked", hitahint_start_alt)
    $('#tab_select_start').val(KEYMAP[tab_select_start_code])
    $('#tab_select_start_code').val(tab_select_start_code)
    $('#tab_select_start_ctrl').attr("checked", tab_select_start_ctrl)
    $('#tab_select_start_alt').attr("checked", tab_select_start_alt)
    $('#form_focus').val(KEYMAP[form_focus_code])
    $('#form_focus_code').val(form_focus_code)
    $('#form_focus_ctrl').attr("checked", form_focus_ctrl)
    $('#form_focus_alt').attr("checked", form_focus_alt)
    $('#cancel').val(KEYMAP[cancel_code])
    $('#cancel_code').val(cancel_code)
    $('#cancel_ctrl').attr("checked", cancel_ctrl)
    $('#cancel_alt').attr("checked", cancel_alt)

    $('#selector_num').val(selector_num)

    for s,i in search_list
      $('#search_name' + i).val(s.title)
      $('#search_url' + i).val(s.url)
  ))

saveSettings =->
  console.log('saveSettings')

  search_list = [
    {title: $('#search_name' + 0).val(), url: $('#search_url' + 0).val(), type: 'websearch'}
    {title: $('#search_name' + 1).val(), url: $('#search_url' + 1).val(), type: 'websearch'}
    {title: $('#search_name' + 2).val(), url: $('#search_url' + 2).val(), type: 'websearch'}
    {title: $('#search_name' + 3).val(), url: $('#search_url' + 3).val(), type: 'websearch'}
    {title: $('#search_name' + 4).val(), url: $('#search_url' + 4).val(), type: 'websearch'}
  ]
  console.log(search_list)

  settings =
    key:
      'START_HITAHINT':
        CODE: parseInt($('#hitahint_start_code').val()) ? DEFAULT_SETTINGS.START_HITAHINT.CODE
        CTRL: $('#hitahint_start_ctrl').is(':checked')  ? DEFAULT_SETTINGS.START_HITAHINT.CTRL
        ALT:  $('#hitahint_start_alt').is(':checked')   ? DEFAULT_SETTINGS.START_HITAHINT.ALT
      'TOGGLE_SELECTOR':
        CODE: parseInt($('#tab_select_start_code').val()) ? DEFAULT_SETTINGS.TOGGLE_SELECTOR.CODE
        CTRL: $('#tab_select_start_ctrl').is(':checked')  ? DEFAULT_SETTINGS.TOGGLE_SELECTOR.CTRL
        ALT:  $('#tab_select_start_alt').is(':checked')   ? DEFAULT_SETTINGS.TOGGLE_SELECTOR.ALT
      'FOCUS_FORM':
        CODE: parseInt($('#form_focus_code').val()) ? DEFAULT_SETTINGS.FOCUS_FORM.CODE
        CTRL: $('#form_focus_ctrl').is(':checked')  ? DEFAULT_SETTINGS.FOCUS_FORM.CTRL
        ALT:  $('#form_focus_alt').is(':checked')   ? DEFAULT_SETTINGS.FOCUS_FORM.ALT
      'CANCEL':
        CODE: parseInt($('#cancel_code').val()) ? DEFAULT_SETTINGS.CANCEL.CODE
        CTRL: $('#cancel_ctrl').is(':checked')  ?  DEFAULT_SETTINGS.CANCEL.CTRL
        ALT:  $('#cancel_alt').is(':checked')   ? DEFAULT_SETTINGS.CANCEL.ALT
    selector:
      'NUM': parseInt($('#selector_num').val()) ? DEFAULT_SETTINGS.SELECTOR.NUM
    search_list: search_list


  console.log(settings)
  chrome.storage.sync.set({'settings': settings}, ((e) -> console.log(e)))

$(->
  restoreSettings()
  $('#save_options').click(saveSettings)

  $(document).keydown((e) ->
    console.log( $(':focus').attr('id'))
    id = $(':focus').attr('id')
    return if not id

    switch id
    case 'hitahint_start', 'tab_select_start', 'form_focus', 'cancel'
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