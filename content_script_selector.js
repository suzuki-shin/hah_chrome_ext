var p, ITEM_TYPE_OF, SELECTOR_NUM, WEB_SEARCH_LIST, makeSelectorConsole, filtering, SelectorMode, Selector;
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
SelectorMode = (function(){
  SelectorMode.displayName = 'SelectorMode';
  var prototype = SelectorMode.prototype, constructor = SelectorMode;
  SelectorMode.keyupMap = function(e){
    switch (e.keyCode) {
    case KEY_CODE.CANCEL:
      constructor.keyUpCancel();
      break;
    case KEY_CODE.TOGGLE_SELECTOR:
      constructor.keyUpSelectorToggle();
      break;
    default:
      constructor.keyUpSelectorFiltering(e);
    }
    return e.preventDefault();
  };
  SelectorMode.keydownMap = function(e){
    switch (e.keyCode) {
    case KEY_CODE.MOVE_NEXT_SELECTOR_CURSOR:
      return constructor.keyUpSelectorCursorNext(e);
    case KEY_CODE.MOVE_PREV_SELECTOR_CURSOR:
      return constructor.keyUpSelectorCursorPrev(e);
    default:
      return function(){
        return alert(e.keyCode);
      };
    }
  };
  SelectorMode.keyUpCancel = function(){
    Main.mode = NeutralMode;
    $('#selectorConsole').hide();
    return $(':focus').blur();
  };
  SelectorMode.keyUpSelectorFiltering = function(e){
    var text, list;
    if (e.keyCode < 65 || e.keyCode > 90) {
      return false;
    }
    console.log('keyUpSelectorFiltering');
    text = $('#selectorInput').val();
    console.log(text);
    list = filtering(text, Main.list).concat(WEB_SEARCH_LIST);
    console.log(list);
    makeSelectorConsole(list);
    return $('#selectorConsole').show();
  };
  SelectorMode.keyUpSelectorToggle = function(){
    Main.mode = NeutralMode;
    return $('#selectorConsole').hide();
  };
  SelectorMode.keyUpSelectorCursorNext = function(e){
    console.log('keyUpSelectorCursorNext');
    $('#selectorList .selected').removeClass("selected").next("tr").addClass("selected");
    return e.preventDefault();
  };
  SelectorMode.keyUpSelectorCursorPrev = function(e){
    console.log('keyUpSelectorCursorPrev');
    $('#selectorList .selected').removeClass("selected").prev("tr").addClass("selected");
    return e.preventDefault();
  };
  SelectorMode.keyUpSelectorDecide = function(){
    var ref$, type, id, url, query;
    console.log('keyUpSelectorDecide');
    ref$ = $('#selectorList tr.selected').attr('id').split('-'), type = ref$[0], id = ref$[1];
    url = $('#selectorList tr.selected span.url').text();
    query = $('#selectorInput').val();
    constructor.keyUpCancel();
    chrome.extension.sendMessage({
      mes: "keyUpSelectorDecide",
      item: {
        id: id,
        url: url,
        type: type,
        query: query
      }
    }, function(res){
      return console.log(res);
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
    return $('body').on('submit', '#selectorForm', SelectorMode.keyUpSelectorDecide);
  };
  function Selector(){}
  return Selector;
}());
Selector.start();