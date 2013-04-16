var ITEM_TYPE_OF, SelectorMode;
ITEM_TYPE_OF = {
  tab: 'TAB',
  history: 'HIS',
  bookmark: 'BKM',
  websearch: 'WEB',
  command: 'COM'
};
SelectorMode = (function(){
  SelectorMode.displayName = 'SelectorMode';
  var prototype = SelectorMode.prototype, constructor = SelectorMode;
  SelectorMode.keydownMap = function(e, keyMapper){
    log('mode: ' + Main.mode);
    log('keyCode: ' + e.keyCode);
    log('Ctrl: ' + Main.ctrl);
    log({
      CODE: e.keyCode,
      CTRL: Main.ctrl,
      ALT: Main.alt,
      SHIFT: Main.shift
    });
    if (Main.changeModKey(true, e.keyCode)) {
      return;
    }
    switch (keyMapper(e.keyCode, Main.ctrl, Main.alt, Main.shift)) {
    case 'MOVE_NEXT_SELECTOR_CURSOR':
      return constructor.moveNextCursor(e);
    case 'MOVE_PREV_SELECTOR_CURSOR':
      return constructor.movePrevCursor(e);
    case 'CANCEL':
      return constructor.cancel(e);
    default:
      return function(){
        return alert(e.keyCode);
      };
    }
  };
  SelectorMode.keyupMap = function(e, keyMapper, makeSelectorConsole, searchList){
    log('mode: ' + Main.mode);
    log('keyCode: ' + e.keyCode);
    log('Ctrl: ' + Main.ctrl);
    log({
      CODE: e.keyCode,
      CTRL: Main.ctrl,
      ALT: Main.alt,
      SHIFT: Main.shift
    });
    if (Main.changeModKey(false, e.keyCode)) {
      return;
    }
    return constructor.filterSelector(e, makeSelectorConsole, searchList);
  };
  constructor.cancel = function(e){
    e.preventDefault();
    Main.mode = NeutralMode;
    $('#selectorConsole').hide();
    return $(':focus').blur();
  };
  SelectorMode.filterSelector = function(e, makeSelectorConsole, searchList){
    var filtering, text;
    log('filterSelector1');
    if (e.keyCode < 48 || e.keyCode > 90) {
      return;
    }
    log('filterSelector2');
    filtering = function(text, list){
      var matchP;
      matchP = function(elem, queries){
        var q;
        return p.all(p.id, (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = queries).length; i$ < len$; ++i$) {
            q = ref$[i$];
            results$.push(elem.title.toLowerCase().search(q) !== -1 || elem.url.toLowerCase().search(q) !== -1 || ITEM_TYPE_OF[elem.type].toLowerCase().search(q) !== -1);
          }
          return results$;
        }()));
      };
      return p.filter(function(t){
        return matchP(t, text.toLowerCase().split(' '));
      }, list);
    };
    log('filterSelector');
    text = $('#selectorInput').val();
    makeSelectorConsole(filtering(text, Main.list).concat(searchList));
    return $('#selectorConsole').show();
  };
  constructor.toggleSelector = function(e){
    e.preventDefault();
    Main.mode = NeutralMode;
    return $('#selectorConsole').hide();
  };
  constructor.moveNextCursor = function(e){
    var x;
    e.preventDefault();
    log('moveNextCursor');
    x = $('#selectorList .selected').removeClass("selected").next("tr").addClass("selected");
    if (x.length === 0) {
      return $('#selectorList tr').first().addClass("selected");
    }
  };
  constructor.movePrevCursor = function(e){
    var x;
    e.preventDefault();
    log('movePrevCursor');
    x = $('#selectorList .selected').removeClass("selected").prev("tr").addClass("selected");
    if (x.length === 0) {
      return $('#selectorList tr').last().addClass("selected");
    }
  };
  constructor.decideSelector = function(e, makeSelectorConsole){
    var ref$, type, id, url, query;
    e.preventDefault();
    log('decideSelector');
    ref$ = $('#selectorList tr.selected').attr('id').split('-'), type = ref$[0], id = ref$[1];
    url = $.trim($('#selectorList tr.selected span.url').text());
    query = $('#selectorInput').val();
    log(id);
    log(url);
    log(type);
    log(query);
    constructor.cancel(e);
    chrome.extension.sendMessage({
      mes: "decideSelector",
      item: {
        id: id,
        url: url,
        type: type,
        query: query
      }
    }, function(list){
      Main.list = list;
      return makeSelectorConsole(list);
    });
    $('#selectorInput').val('');
    return false;
  };
  function SelectorMode(){}
  return SelectorMode;
}());