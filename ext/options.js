var p, AVAILABLE_KEYCODES, res$, k, ref$, v, restoreSettings, saveSettings;
p = prelude;
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
    var hitahint_start_code, ref$, ref1$, hitahint_start_ctrl, hitahint_start_alt, tab_select_start_code, tab_select_start_ctrl, tab_select_start_alt, form_focus_code, form_focus_ctrl, form_focus_alt, cancel_code, cancel_ctrl, cancel_alt, selector_num, search_list, i$, len$, i, s, results$ = [];
    console.log('sync.get');
    console.log(d);
    hitahint_start_code = (d != null ? (ref$ = d.settings) != null ? (ref1$ = ref$.key) != null ? ref1$.START_HITAHINT : void 8 : void 8 : void 8) != null
      ? d.settings.key.START_HITAHINT.CODE
      : DEFAULT_SETTINGS.START_HITAHINT.CODE;
    hitahint_start_ctrl = (d != null ? (ref$ = d.settings) != null ? (ref1$ = ref$.key) != null ? ref1$.START_HITAHINT : void 8 : void 8 : void 8) != null
      ? d.settings.key.START_HITAHINT.CTRL
      : DEFAULT_SETTINGS.START_HITAHINT.CTRL;
    hitahint_start_alt = (d != null ? (ref$ = d.settings) != null ? (ref1$ = ref$.key) != null ? ref1$.START_HITAHINT : void 8 : void 8 : void 8) != null
      ? d.settings.key.START_HITAHINT.ALT
      : DEFAULT_SETTINGS.START_HITAHINT.ALT;
    tab_select_start_code = (d != null ? (ref$ = d.settings) != null ? (ref1$ = ref$.key) != null ? ref1$.TOGGLE_SELECTOR : void 8 : void 8 : void 8) != null
      ? d.settings.key.TOGGLE_SELECTOR.CODE
      : DEFAULT_SETTINGS.TOGGLE_SELECTOR.CODE;
    tab_select_start_ctrl = (d != null ? (ref$ = d.settings) != null ? (ref1$ = ref$.key) != null ? ref1$.TOGGLE_SELECTOR : void 8 : void 8 : void 8) != null
      ? d.settings.key.TOGGLE_SELECTOR.CTRL
      : DEFAULT_SETTINGS.TOGGLE_SELECTOR.CTRL;
    tab_select_start_alt = (d != null ? (ref$ = d.settings) != null ? (ref1$ = ref$.key) != null ? ref1$.TOGGLE_SELECTOR : void 8 : void 8 : void 8) != null
      ? d.settings.key.TOGGLE_SELECTOR.ALT
      : DEFAULT_SETTINGS.TOGGLE_SELECTOR.ALT;
    form_focus_code = (d != null ? (ref$ = d.settings) != null ? (ref1$ = ref$.key) != null ? ref1$.FOCUS_FORM : void 8 : void 8 : void 8) != null
      ? d.settings.key.FOCUS_FORM.CODE
      : DEFAULT_SETTINGS.FOCUS_FORM.CODE;
    form_focus_ctrl = (d != null ? (ref$ = d.settings) != null ? (ref1$ = ref$.key) != null ? ref1$.FOCUS_FORM : void 8 : void 8 : void 8) != null
      ? d.settings.key.FOCUS_FORM.CTRL
      : DEFAULT_SETTINGS.FOCUS_FORM.CTRL;
    form_focus_alt = (d != null ? (ref$ = d.settings) != null ? (ref1$ = ref$.key) != null ? ref1$.FOCUS_FORM : void 8 : void 8 : void 8) != null
      ? d.settings.key.FOCUS_FORM.ALT
      : DEFAULT_SETTINGS.FOCUS_FORM.ALT;
    cancel_code = (d != null ? (ref$ = d.settings) != null ? (ref1$ = ref$.key) != null ? ref1$.CANCEL : void 8 : void 8 : void 8) != null
      ? d.settings.key.CANCEL.CODE
      : DEFAULT_SETTINGS.CANCEL.CODE;
    cancel_ctrl = (d != null ? (ref$ = d.settings) != null ? (ref1$ = ref$.key) != null ? ref1$.CANCEL : void 8 : void 8 : void 8) != null
      ? d.settings.key.CANCEL.CTRL
      : DEFAULT_SETTINGS.CANCEL.CTRL;
    cancel_alt = (d != null ? (ref$ = d.settings) != null ? (ref1$ = ref$.key) != null ? ref1$.CANCEL : void 8 : void 8 : void 8) != null
      ? d.settings.key.CANCEL.ALT
      : DEFAULT_SETTINGS.CANCEL.ALT;
    selector_num = (d != null ? (ref$ = d.settings) != null ? (ref1$ = ref$.selector) != null ? ref1$.NUM : void 8 : void 8 : void 8) != null
      ? d.settings.selector.NUM
      : DEFAULT_SETTINGS.SELECTOR.NUM;
    search_list = (d != null ? (ref$ = d.settings) != null ? ref$.search_list : void 8 : void 8) != null ? d.settings.search_list : COMMAND_LIST;
    $('#hitahint_start').val(KEYMAP[hitahint_start_code]);
    $('#hitahint_start_code').val(hitahint_start_code);
    $('#hitahint_start_ctrl').attr("checked", hitahint_start_ctrl);
    $('#hitahint_start_alt').attr("checked", hitahint_start_alt);
    $('#tab_select_start').val(KEYMAP[tab_select_start_code]);
    $('#tab_select_start_code').val(tab_select_start_code);
    $('#tab_select_start_ctrl').attr("checked", tab_select_start_ctrl);
    $('#tab_select_start_alt').attr("checked", tab_select_start_alt);
    $('#form_focus').val(KEYMAP[form_focus_code]);
    $('#form_focus_code').val(form_focus_code);
    $('#form_focus_ctrl').attr("checked", form_focus_ctrl);
    $('#form_focus_alt').attr("checked", form_focus_alt);
    $('#cancel').val(KEYMAP[cancel_code]);
    $('#cancel_code').val(cancel_code);
    $('#cancel_ctrl').attr("checked", cancel_ctrl);
    $('#cancel_alt').attr("checked", cancel_alt);
    $('#selector_num').val(selector_num);
    for (i$ = 0, len$ = search_list.length; i$ < len$; ++i$) {
      i = i$;
      s = search_list[i$];
      $('#search_name' + i).val(s.title);
      results$.push($('#search_url' + i).val(s.url));
    }
    return results$;
  });
};
saveSettings = function(){
  var search_list, settings, ref$;
  console.log('saveSettings');
  search_list = [
    {
      title: $('#search_name' + 0).val(),
      url: $('#search_url' + 0).val(),
      type: 'websearch'
    }, {
      title: $('#search_name' + 1).val(),
      url: $('#search_url' + 1).val(),
      type: 'websearch'
    }, {
      title: $('#search_name' + 2).val(),
      url: $('#search_url' + 2).val(),
      type: 'websearch'
    }, {
      title: $('#search_name' + 3).val(),
      url: $('#search_url' + 3).val(),
      type: 'websearch'
    }, {
      title: $('#search_name' + 4).val(),
      url: $('#search_url' + 4).val(),
      type: 'websearch'
    }
  ];
  console.log(search_list);
  settings = {
    key: {
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
      'FOCUS_FORM': {
        CODE: (ref$ = parseInt($('#form_focus_code').val())) != null
          ? ref$
          : DEFAULT_SETTINGS.FOCUS_FORM.CODE,
        CTRL: (ref$ = $('#form_focus_ctrl').is(':checked')) != null
          ? ref$
          : DEFAULT_SETTINGS.FOCUS_FORM.CTRL,
        ALT: (ref$ = $('#form_focus_alt').is(':checked')) != null
          ? ref$
          : DEFAULT_SETTINGS.FOCUS_FORM.ALT
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
    },
    selector: {
      'NUM': (ref$ = parseInt($('#selector_num').val())) != null
        ? ref$
        : DEFAULT_SETTINGS.SELECTOR.NUM
    },
    search_list: search_list
  };
  console.log(settings);
  return chrome.storage.sync.set({
    'settings': settings
  }, function(e){
    return console.log(e);
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
    case 'form_focus':
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