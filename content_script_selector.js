var p, ITEM_TYPE_OF, SELECTOR_NUM, WEB_SEARCH_LIST, makeSelectorConsole, SelectorMode, Selector;
p = prelude;
ITEM_TYPE_OF = {
  tab: 'TAB',
  history: 'HIS',
  bookmark: 'BKM',
  websearch: 'WEB',
  command: 'COM'
};
SELECTOR_NUM = 20;
WEB_SEARCH_LIST = [
  {
    title: 'google検索',
    url: 'https://www.google.co.jp/#hl=ja&q=',
    type: 'websearch'
  }, {
    title: 'alc辞書',
    url: 'http://eow.alc.co.jp/search?ref=sa&q=',
    type: 'websearch'
  }
];
makeSelectorConsole = function(list){
  var ts, t;
  if ($('#selectorList')) {
    $('#selectorList').remove();
  }
  console.log(list);
  ts = p.concat(p.take(SELECTOR_NUM, (function(){
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
SelectorMode = (function(){
  SelectorMode.displayName = 'SelectorMode';
  var prototype = SelectorMode.prototype, constructor = SelectorMode;
  SelectorMode.keydownMap = function(e){
    console.log('mode: ' + Main.mode);
    console.log('keyCode: ' + e.keyCode);
    console.log('Ctrl: ' + Main.ctrl);
    console.log({
      CODE: e.keyCode,
      CTRL: Main.ctrl,
      ALT: Main.alt
    });
    if (e.keyCode === CTRL_KEYCODE) {
      Main.ctrl = true;
      return;
    }
    switch (keyMapper(e.keyCode, Main.ctrl, Main.alt)) {
    case 'MOVE_NEXT_SELECTOR_CURSOR':
      return constructor.keyDownSelectorCursorNext(e);
    case 'MOVE_PREV_SELECTOR_CURSOR':
      return constructor.keyDownSelectorCursorPrev(e);
    case 'CANCEL':
      return constructor.keyUpCancel(e);
    default:
      return function(){
        return alert(e.keyCode);
      };
    }
  };
  SelectorMode.keyupMap = function(e){
    console.log('mode: ' + Main.mode);
    console.log('keyCode: ' + e.keyCode);
    console.log('Ctrl: ' + Main.ctrl);
    console.log({
      CODE: e.keyCode,
      CTRL: Main.ctrl,
      ALT: Main.alt
    });
    if (e.keyCode === CTRL_KEYCODE) {
      Main.ctrl = false;
      return;
    }
    return constructor.keyUpSelectorFiltering(e);
  };
  SelectorMode.keyUpCancel = function(e){
    e.preventDefault();
    Main.mode = NeutralMode;
    $('#selectorConsole').hide();
    return $(':focus').blur();
  };
  SelectorMode.keyUpSelectorFiltering = function(e){
    var filtering, text;
    console.log('keyUpSelectorFiltering1');
    if (e.keyCode < 65 || e.keyCode > 90) {
      return;
    }
    console.log('keyUpSelectorFiltering2');
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
    console.log('keyUpSelectorFiltering');
    text = $('#selectorInput').val();
    makeSelectorConsole(filtering(text, Main.list).concat(WEB_SEARCH_LIST));
    return $('#selectorConsole').show();
  };
  SelectorMode.keyUpSelectorToggle = function(e){
    e.preventDefault();
    Main.mode = NeutralMode;
    return $('#selectorConsole').hide();
  };
  SelectorMode.keyDownSelectorCursorNext = function(e){
    e.preventDefault();
    console.log('keyDownSelectorCursorNext');
    return $('#selectorList .selected').removeClass("selected").next("tr").addClass("selected");
  };
  SelectorMode.keyDownSelectorCursorPrev = function(e){
    e.preventDefault();
    console.log('keyDownSelectorCursorPrev');
    return $('#selectorList .selected').removeClass("selected").prev("tr").addClass("selected");
  };
  SelectorMode.keyUpSelectorDecide = function(e){
    var ref$, type, id, url, query;
    console.log('keyUpSelectorDecide');
    e.preventDefault();
    console.log('keyUpSelectorDecide');
    ref$ = $('#selectorList tr.selected').attr('id').split('-'), type = ref$[0], id = ref$[1];
    url = $('#selectorList tr.selected span.url').text();
    query = $('#selectorInput').val();
    constructor.keyUpCancel(e);
    chrome.extension.sendMessage({
      mes: "keyUpSelectorDecide",
      item: {
        id: id,
        url: url,
        type: type,
        query: query
      }
    }, function(list){
      return Main.list = list;
    });
    $('#selectorInput').val('');
    return false;
  };
  function SelectorMode(){}
  return SelectorMode;
}());
NeutralMode.keyUpSelectorToggle = function(){
  Main.mode = SelectorMode;
  $('#selectorConsole').show();
  return $('#selectorInput').focus();
};
Selector = (function(){
  Selector.displayName = 'Selector';
  var prototype = Selector.prototype, constructor = Selector;
  constructor.start = function(){
    chrome.extension.sendMessage({
      mes: "makeSelectorConsole"
    }, function(list){
      console.log('extension.sendMessage');
      console.log(list);
      Main.list = list;
      $('body').append('<div id="selectorConsole"><form id="selectorForm"><input id="selectorInput" type="text" /></form></div>');
      return makeSelectorConsole(list);
    });
    return $('body').on('submit', '#selectorForm', function(e){
      return SelectorMode.keyUpSelectorDecide(e);
    });
  };
  function Selector(){}
  return Selector;
}());
Selector.start();