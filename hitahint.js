var p, FORM_INPUT_FIELDS, ITEM_TYPE_OF, SELECTOR_NUM, KEY_CODE, _HINT_KEYS, HINT_KEYS, k1, v1, k2, v2, WEB_SEARCH_LIST, keyCodeToIndex, indexToKeyCode, isHitAHintKey, makeSelectorConsole, filtering, isFocusingForm, Main, NeutralMode, HitAHintMode, FormFocusMode, SelectorMode;
p = prelude;
FORM_INPUT_FIELDS = 'input[type="text"], textarea, select';
ITEM_TYPE_OF = {
  tab: 'TAB',
  history: 'HIS',
  bookmark: 'BKM',
  websearch: 'WEB',
  command: 'COM'
};
SELECTOR_NUM = 20;
KEY_CODE = {
  START_HITAHINT: 69,
  FOCUS_FORM: 70,
  TOGGLE_SELECTOR: 186,
  CANCEL: 27,
  MOVE_NEXT_SELECTOR_CURSOR: 40,
  MOVE_PREV_SELECTOR_CURSOR: 38,
  MOVE_NEXT_FORM: 34,
  MOVE_PREV_FORM: 33,
  BACK_HISTORY: 72
};
_HINT_KEYS = {
  65: 'A',
  66: 'B',
  67: 'C',
  68: 'D',
  69: 'E',
  70: 'F',
  71: 'G',
  72: 'H',
  73: 'I',
  74: 'J',
  75: 'K',
  76: 'L',
  77: 'M',
  78: 'N',
  79: 'O',
  80: 'P',
  81: 'Q',
  82: 'R',
  83: 'S',
  84: 'T',
  85: 'U',
  86: 'V',
  87: 'W',
  88: 'X',
  89: 'Y',
  90: 'Z'
};
HINT_KEYS = {};
for (k1 in _HINT_KEYS) {
  v1 = _HINT_KEYS[k1];
  for (k2 in _HINT_KEYS) {
    v2 = _HINT_KEYS[k2];
    HINT_KEYS[parseInt(k1) * 100 + parseInt(k2)] = v1 + v2;
  }
}
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
keyCodeToIndex = function(firstKeyCode, secondKeyCode){
  var k, v;
  return $.inArray(parseInt(firstKeyCode) * 100 + parseInt(secondKeyCode), (function(){
    var ref$, results$ = [];
    for (k in ref$ = HINT_KEYS) {
      v = ref$[k];
      results$.push(parseInt(k));
    }
    return results$;
  }()));
};
indexToKeyCode = function(index){
  var k, v;
  return (function(){
    var ref$, results$ = [];
    for (k in ref$ = HINT_KEYS) {
      v = ref$[k];
      results$.push(k);
    }
    return results$;
  }())[index];
};
isHitAHintKey = function(keyCode){
  var k, v;
  return $.inArray(String(keyCode), (function(){
    var ref$, results$ = [];
    for (k in ref$ = _HINT_KEYS) {
      v = ref$[k];
      results$.push(k);
    }
    return results$;
  }())) !== -1;
};
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
isFocusingForm = function(){
  var focusElems;
  console.log('isFocusingForm');
  focusElems = $(':focus');
  console.log(focusElems.attr('type'));
  return focusElems[0] && ((focusElems[0].nodeName.toLowerCase() === "input" && focusElems.attr('type') === "text") || focusElems[0].nodeName.toLowerCase() === "textarea");
};
Main = (function(){
  Main.displayName = 'Main';
  var prototype = Main.prototype, constructor = Main;
  function Main(){}
  return Main;
}());
NeutralMode = (function(){
  NeutralMode.displayName = 'NeutralMode';
  var prototype = NeutralMode.prototype, constructor = NeutralMode;
  NeutralMode.keyupMap = function(e){
    switch (e.keyCode) {
    case KEY_CODE.START_HITAHINT:
      constructor.keyUpHitAHintStart();
      break;
    case KEY_CODE.FOCUS_FORM:
      constructor.keyUpFocusForm();
      break;
    case KEY_CODE.TOGGLE_SELECTOR:
      constructor.keyUpSelectorToggle();
      break;
    case KEY_CODE.BACK_HISTORY:
      constructor.keyUpHistoryBack();
      break;
    default:
      (function(){
        return console.log('default');
      });
    }
    return e.preventDefault();
  };
  NeutralMode.keydownMap = function(e){
    return console.log('keydownMap');
  };
  NeutralMode.keyUpHitAHintStart = function(){
    Main.mode = HitAHintMode;
    return Main.links.addClass('links').html(function(i, oldHtml){
      if (HINT_KEYS[indexToKeyCode(i)] != null) {
        return '<div class="hintKey">' + HINT_KEYS[indexToKeyCode(i)] + '</div> ' + oldHtml;
      } else {
        return oldHtml;
      }
    });
  };
  NeutralMode.keyUpFocusForm = function(){
    Main.mode = FormFocusMode;
    Main.formInputFieldIndex = 0;
    return $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus();
  };
  NeutralMode.keyUpSelectorToggle = function(){
    Main.mode = SelectorMode;
    $('#selectorConsole').show();
    return $('#selectorInput').focus();
  };
  NeutralMode.keyUpHistoryBack = function(){
    return history.back();
  };
  function NeutralMode(){}
  return NeutralMode;
}());
HitAHintMode = (function(){
  HitAHintMode.displayName = 'HitAHintMode';
  var prototype = HitAHintMode.prototype, constructor = HitAHintMode;
  HitAHintMode.keyupMap = function(e){
    switch (e.keyCode) {
    case KEY_CODE.CANCEL:
      constructor.keyUpCancel();
      break;
    default:
      constructor.keyUpHintKey(e.keyCode);
    }
    return e.preventDefault();
  };
  HitAHintMode.keydownMap = function(e){
    return console.log('keydownMap');
  };
  HitAHintMode.firstKeyCode = null;
  HitAHintMode.keyUpCancel = function(){
    Main.mode = NeutralMode;
    Main.links.removeClass('links');
    $('.hintKey').remove();
    return constructor.firstKeyCode = null;
  };
  HitAHintMode.keyUpHintKey = function(keyCode){
    var idx;
    console.log('hit!: ' + keyCode + ', 1stkey: ' + this.firstKeyCode);
    if (!isHitAHintKey(keyCode)) {
      return;
    }
    if (this.firstKeyCode === null) {
      return this.firstKeyCode = keyCode;
    } else {
      idx = keyCodeToIndex(this.firstKeyCode, keyCode);
      Main.links[idx].click();
      Main.mode = NeutralMode;
      Main.links.removeClass('links');
      $('.hintKey').remove();
      return this.firstKeyCode = null;
    }
  };
  function HitAHintMode(){}
  return HitAHintMode;
}());
FormFocusMode = (function(){
  FormFocusMode.displayName = 'FormFocusMode';
  var prototype = FormFocusMode.prototype, constructor = FormFocusMode;
  FormFocusMode.keyupMap = function(e){
    switch (e.keyCode) {
    case KEY_CODE.MOVE_NEXT_FORM:
      constructor.keyUpFormNext();
      break;
    case KEY_CODE.MOVE_PREV_FORM:
      constructor.keyUpFormPrev();
      break;
    case KEY_CODE.CANCEL:
      constructor.keyUpCancel();
      break;
    default:
      (function(){
        return console.log('default');
      });
    }
    return e.preventDefault();
  };
  FormFocusMode.keydownMap = function(e){
    return console.log('keydownMap');
  };
  FormFocusMode.keyUpFormNext = function(){
    console.log('keyUpFormNext');
    Main.formInputFieldIndex += 1;
    console.log(Main.formInputFieldIndex);
    console.log($(FORM_INPUT_FIELDS));
    console.log($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex));
    if ($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex) != null) {
      return $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus();
    }
  };
  FormFocusMode.keyUpFormPrev = function(){
    console.log('keyUpFormPrev');
    Main.formInputFieldIndex -= 1;
    console.log(Main.formInputFieldIndex);
    console.log($(FORM_INPUT_FIELDS));
    console.log($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex));
    if ($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex) != null) {
      return $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus();
    }
  };
  FormFocusMode.keyUpCancel = function(){
    Main.mode = NeutralMode;
    return $(':focus').blur();
  };
  function FormFocusMode(){}
  return FormFocusMode;
}());
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
Main.start = function(){
  var _clickables;
  Main.mode = NeutralMode;
  _clickables = $('a');
  Main.links = _clickables.length === void 8 ? [_clickables] : _clickables;
  if (isFocusingForm()) {
    Main.mode = FormFocusMode;
  }
  chrome.extension.sendMessage({
    mes: "makeSelectorConsole"
  }, function(list){
    console.log('extension.sendMessage');
    console.log(list);
    Main.list = list;
    $('body').append('<div id="selectorConsole"><form id="selectorForm"><input id="selectorInput" type="text" /></form></div>');
    return makeSelectorConsole(list);
  });
  $(FORM_INPUT_FIELDS).focus(function(){
    console.log('form focus');
    return Main.mode = FormFocusMode;
  });
  $(FORM_INPUT_FIELDS).blur(function(){
    console.log('form blur');
    return Main.mode = NeutralMode;
  });
  $('body').on('submit', '#selectorForm', SelectorMode.keyUpSelectorDecide);
  $(document).keyup(function(e){
    console.log('keyCode: ' + e.keyCode);
    console.log('mode: ' + Main.mode);
    return Main.mode.keyupMap(e);
  });
  return $(document).keydown(function(e){
    console.log('keyCode: ' + e.keyCode);
    console.log('mode: ' + Main.mode);
    return Main.mode.keydownMap(e);
  });
};
Main.start();