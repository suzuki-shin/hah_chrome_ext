var AVAILABLE_KEYCODES, res$, k, ref$, v, restoreSettings, saveSettings;
res$ = [];
for (k in ref$ = KEYMAP) {
  v = ref$[k];
  if (k >= 27) {
    res$.push(parseInt(k));
  }
}
AVAILABLE_KEYCODES = res$;
restoreSettings = function(){
  return chrome.storage.sync.get('settings', function(d){
    var hitahint_start_code, hitahint_start_ctrl, hitahint_start_alt, tab_select_start_code, tab_select_start_ctrl, tab_select_start_alt, cancel_code, cancel_ctrl, cancel_alt;
    console.log('sync.get');
    console.log(d);
    hitahint_start_code = d.settings != null && d.settings.START_HITAHINT != null
      ? d.settings.START_HITAHINT.CODE
      : DEFAULT_SETTINGS.START_HITAHINT.CODE;
    hitahint_start_ctrl = d.settings != null && d.settings.START_HITAHINT != null
      ? d.settings.START_HITAHINT.CTRL
      : DEFAULT_SETTINGS.START_HITAHINT.CTRL;
    hitahint_start_alt = d.settings != null && d.settings.START_HITAHINT != null
      ? d.settings.START_HITAHINT.ALT
      : DEFAULT_SETTINGS.START_HITAHINT.ALT;
    tab_select_start_code = d.settings != null && d.settings.TOGGLE_SELECTOR != null
      ? d.settings.TOGGLE_SELECTOR.CODE
      : DEFAULT_SETTINGS.TOGGLE_SELECTOR.CODE;
    tab_select_start_ctrl = d.settings != null && d.settings.TOGGLE_SELECTOR != null
      ? d.settings.TOGGLE_SELECTOR.CTRL
      : DEFAULT_SETTINGS.TOGGLE_SELECTOR.CTRL;
    tab_select_start_alt = d.settings != null && d.settings.TOGGLE_SELECTOR != null
      ? d.settings.TOGGLE_SELECTOR.ALT
      : DEFAULT_SETTINGS.TOGGLE_SELECTOR.ALT;
    cancel_code = d.settings != null && d.settings.CANCEL
      ? d.settings.CANCEL.CODE
      : DEFAULT_SETTINGS.CANCEL.CODE;
    cancel_ctrl = d.settings != null && d.settings.CANCEL
      ? d.settings.CANCEL.CTRL
      : DEFAULT_SETTINGS.CANCEL.CTRL;
    cancel_alt = d.settings != null && d.settings.CANCEL
      ? d.settings.CANCEL.ALT
      : DEFAULT_SETTINGS.CANCEL.ALT;
    $('#hitahint_start').val(KEYMAP[hitahint_start_code]);
    $('#hitahint_start_code').val(hitahint_start_code);
    $('#hitahint_start_ctrl').attr("checked", hitahint_start_ctrl);
    $('#hitahint_start_alt').attr("checked", hitahint_start_alt);
    $('#tab_select_start').val(KEYMAP[tab_select_start_code]);
    $('#tab_select_start_code').val(tab_select_start_code);
    $('#tab_select_start_ctrl').attr("checked", tab_select_start_ctrl);
    $('#tab_select_start_alt').attr("checked", tab_select_start_alt);
    $('#cancel').val(KEYMAP[cancel_code]);
    $('#cancel_code').val(cancel_code);
    $('#cancel_ctrl').attr("checked", cancel_ctrl);
    return $('#cancel_alt').attr("checked", cancel_alt);
  });
};
saveSettings = function(){
  var settings, ref$;
  console.log('saveSettings');
  settings = {
    'START_HITAHINT': {
      CODE: (ref$ = parseInt($('#hitahint_start_code').val())) != null
        ? ref$
        : DEFAULT_SETTINGS.START_HITAHINT.CODE,
      CTRL: (ref$ = $('#hitahint_start_ctrl').is(':checked')) != null
        ? ref$
        : DEFAULT_SETTINGS.START_HITAHINT.CTRL,
      ALT: (ref$ = $('#hitahint_start_alt').is(':checked')) != null
        ? ref$
        : DEFAULT_SETTINGS.START_HITAHINT.ALT
    },
    'TOGGLE_SELECTOR': {
      CODE: (ref$ = parseInt($('#tab_select_start_code').val())) != null
        ? ref$
        : DEFAULT_SETTINGS.TOGGLE_SELECTOR.CODE,
      CTRL: (ref$ = $('#tab_select_start_ctrl').is(':checked')) != null
        ? ref$
        : DEFAULT_SETTINGS.TOGGLE_SELECTOR.CTRL,
      ALT: (ref$ = $('#tab_select_start_alt').is(':checked')) != null
        ? ref$
        : DEFAULT_SETTINGS.TOGGLE_SELECTOR.ALT
    },
    'CANCEL': {
      CODE: (ref$ = parseInt($('#cancel_code').val())) != null
        ? ref$
        : DEFAULT_SETTINGS.CANCEL.CODE,
      CTRL: (ref$ = $('#cancel_ctrl').is(':checked')) != null
        ? ref$
        : DEFAULT_SETTINGS.CANCEL.CTRL,
      ALT: (ref$ = $('#cancel_alt').is(':checked')) != null
        ? ref$
        : DEFAULT_SETTINGS.CANCEL.ALT
    }
  };
  console.log(settings);
  return chrome.storage.sync.set({
    'settings': settings
  });
};
$(function(){
  restoreSettings();
  $('#save_options').click(saveSettings);
  return $(document).keydown(function(e){
    var id, keyName;
    console.log($(':focus').attr('id'));
    id = $(':focus').attr('id');
    if (!id) {
      return;
    }
    switch (id) {
    case 'hitahint_start':
    case 'tab_select_start':
    case 'cancel':
      if (in$(e.keyCode, AVAILABLE_KEYCODES)) {
        e.preventDefault();
        keyName = KEYMAP[e.keyCode];
        console.log('keyName:' + keyName);
        $(':focus').val(keyName);
        return $('#' + id + '_code').val(parseInt(e.keyCode));
      } else {
        return console.log('else: ' + e.keyCode);
      }
    }
  });
});
function in$(x, arr){
  var i = -1, l = arr.length >>> 0;
  while (++i < l) if (x === arr[i] && i in arr) return true;
  return false;
}