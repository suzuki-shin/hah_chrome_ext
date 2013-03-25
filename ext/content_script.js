var ITEM_TYPE_OF, DEFAULT_SELECTOR_NUM, isFocusingForm, Main;
ITEM_TYPE_OF = {
  tab: 'TAB',
  history: 'HIS',
  bookmark: 'BKM',
  websearch: 'WEB',
  command: 'COM'
};
DEFAULT_SELECTOR_NUM = 20;
isFocusingForm = function(){
  var focusElems;
  log('isFocusingForm');
  focusElems = $(':focus');
  log(focusElems.attr('type'));
  return focusElems[0] && ((focusElems[0].nodeName.toLowerCase() === "input" && focusElems.attr('type') === "text") || focusElems[0].nodeName.toLowerCase() === "textarea");
};
Main = (function(){
  Main.displayName = 'Main';
  var prototype = Main.prototype, constructor = Main;
  function Main(){}
  return Main;
}());
Main.start = function(keyMapper, makeSelectorConsole, searchList){
  Main.ctrl = false;
  Main.alt = false;
  Main.mode = NeutralMode;
  $(document).keyup(function(e){
    return Main.mode.keyupMap(e, keyMapper, makeSelectorConsole, searchList);
  });
  $(document).keydown(function(e){
    return Main.mode.keydownMap(e, keyMapper);
  });
  chrome.extension.sendMessage({
    mes: "makeSelectorConsole"
  }, function(list){
    log('extension.sendMessage');
    log(list);
    Main.list = list;
    $('body').append('<div id="selectorConsole"><form id="selectorForm"><input id="selectorInput" type="text" /></form></div>');
    return makeSelectorConsole(list);
  });
  $('body').on('submit', '#selectorForm', function(e){
    return SelectorMode.decideSelector(e, makeSelectorConsole);
  });
  if (isFocusingForm()) {
    Main.mode = FormFocusMode;
  }
  $('body').on('focus', FORM_INPUT_FIELDS, function(){
    log('form focus');
    return Main.mode = FormFocusMode;
  });
  return $('body').on('blur', FORM_INPUT_FIELDS, function(){
    log('form blur');
    return Main.mode = NeutralMode;
  });
};
chrome.storage.sync.get('settings', function(d){
  var keyMapper, selector_num, ref$, ref1$, ref2$, searchList, makeSelectorConsole;
  log(d);
  keyMapper = function(keyCode, ctrl, alt){
    var KEY, k, v;
    KEY = DEFAULT_SETTINGS;
    if (d.settings.key) {
      import$(KEY, d.settings.key);
    }
    log('keyMapper');
    log(KEY);
    return p.first((function(){
      var ref$, results$ = [];
      for (k in ref$ = KEY) {
        v = ref$[k];
        if (v.CODE === keyCode && v.CTRL === ctrl && v.ALT === alt) {
          results$.push(k);
        }
      }
      return results$;
    }()));
  };
  selector_num = (ref$ = (ref1$ = d.settings) != null ? (ref2$ = ref1$.selector) != null ? ref2$.NUM : void 8 : void 8) != null ? ref$ : DEFAULT_SELECTOR_NUM;
  log(selector_num);
  searchList = p.filter(function(l){
    return l.url != null && l.url !== '';
  }, (ref$ = d.settings.search_list) != null ? ref$ : COMMAND_LIST);
  makeSelectorConsole = function(list){
    var ts, t;
    if ($('#selectorList')) {
      $('#selectorList').remove();
    }
    log(list);
    ts = p.concat(p.take(selector_num, (function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = list).length; i$ < len$; ++i$) {
        t = ref$[i$];
        results$.push('<tr id="' + t.type + '-' + t.id + '"><td><span class="title">[' + ITEM_TYPE_OF[t.type] + '] ' + t.title + ' </span><span class="url"> ' + t.url + '</span></td></tr>');
      }
      return results$;
    }())));
    $('#selectorConsole').append('<table id="selectorList">' + ts + '</table>');
    return $('#selectorList tr:first').addClass("selected");
  };
  return Main.start(keyMapper, makeSelectorConsole, searchList);
});
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}