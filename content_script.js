var p, CTRL_KEYCODE, ALT_KEYCODE, ITEM_TYPE_OF, DEFAULT_SELECTOR_NUM, WEB_SEARCH_LIST, FORM_INPUT_FIELDS, CLICKABLES, _HINT_KEYS, HINT_KEYS, k1, v1, k2, v2, keyCodeToIndex, indexToKeyCode, isHitAHintKey, isFocusingForm;
p = prelude;
CTRL_KEYCODE = 17;
ALT_KEYCODE = 18;
ITEM_TYPE_OF = {
  tab: 'TAB',
  history: 'HIS',
  bookmark: 'BKM',
  websearch: 'WEB',
  command: 'COM'
};
DEFAULT_SELECTOR_NUM = 20;
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
FORM_INPUT_FIELDS = 'input[type="text"]:not("#selectorInput"), textarea, select';
CLICKABLES = 'a';
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
isFocusingForm = function(){
  var focusElems;
  console.log('isFocusingForm');
  focusElems = $(':focus');
  console.log(focusElems.attr('type'));
  return focusElems[0] && ((focusElems[0].nodeName.toLowerCase() === "input" && focusElems.attr('type') === "text") || focusElems[0].nodeName.toLowerCase() === "textarea");
};
chrome.storage.sync.get('settings', function(d){
  var KEY, keyMapper, selector_num, ref$, ref1$, ref2$, makeSelectorConsole, Main, NeutralMode, SelectorMode, HitAHintMode, FormFocusMode;
  console.log(d);
  KEY = DEFAULT_SETTINGS;
  if (d.settings.key) {
    import$(KEY, d.settings.key);
  }
  console.log(KEY);
  keyMapper = function(keyCode, ctrl, alt){
    var k, v;
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
  console.log(selector_num);
  makeSelectorConsole = function(list){
    var ts, t;
    if ($('#selectorList')) {
      $('#selectorList').remove();
    }
    console.log(list);
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
  Main = (function(){
    Main.displayName = 'Main';
    var prototype = Main.prototype, constructor = Main;
    function Main(){}
    return Main;
  }());
  NeutralMode = (function(){
    NeutralMode.displayName = 'NeutralMode';
    var prototype = NeutralMode.prototype, constructor = NeutralMode;
    NeutralMode.keydownMap = function(e){
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
      case 'START_HITAHINT':
        return constructor.startHah();
      case 'FOCUS_FORM':
        return constructor.focusForm();
      case 'TOGGLE_SELECTOR':
        return constructor.toggleSelector();
      default:
        return function(){
          return console.log('default');
        };
      }
    };
    NeutralMode.keyupMap = function(e){
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
      }
    };
    constructor.backHistory = function(){
      return history.back();
    };
    constructor.toggleSelector = function(){
      Main.mode = SelectorMode;
      $('#selectorConsole').show();
      return $('#selectorInput').focus();
    };
    constructor.focusForm = function(){
      Main.mode = FormFocusMode;
      Main.formInputFieldIndex = 0;
      return $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus();
    };
    constructor.startHah = function(){
      Main.mode = HitAHintMode;
      return $(CLICKABLES).addClass('links').html(function(i, oldHtml){
        if (HINT_KEYS[indexToKeyCode(i)] != null) {
          return '<div class="hintKey">' + HINT_KEYS[indexToKeyCode(i)] + '</div> ' + oldHtml;
        } else {
          return oldHtml;
        }
      });
    };
    function NeutralMode(){}
    return NeutralMode;
  }());
  Main.start = function(){
    Main.ctrl = false;
    Main.alt = false;
    Main.mode = NeutralMode;
    $(document).keyup(function(e){
      return Main.mode.keyupMap(e);
    });
    $(document).keydown(function(e){
      return Main.mode.keydownMap(e);
    });
    chrome.extension.sendMessage({
      mes: "makeSelectorConsole"
    }, function(list){
      console.log('extension.sendMessage');
      console.log(list);
      Main.list = list;
      $('body').append('<div id="selectorConsole"><form id="selectorForm"><input id="selectorInput" type="text" /></form></div>');
      return makeSelectorConsole(list);
    });
    $('body').on('submit', '#selectorForm', function(e){
      return SelectorMode.decideSelector(e);
    });
    if (isFocusingForm()) {
      Main.mode = FormFocusMode;
    }
    $('body').on('focus', FORM_INPUT_FIELDS, function(){
      console.log('form focus');
      return Main.mode = FormFocusMode;
    });
    return $('body').on('blur', FORM_INPUT_FIELDS, function(){
      console.log('form blur');
      return Main.mode = NeutralMode;
    });
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
      return constructor.filterSelector(e);
    };
    constructor.cancel = function(e){
      e.preventDefault();
      Main.mode = NeutralMode;
      $('#selectorConsole').hide();
      return $(':focus').blur();
    };
    SelectorMode.filterSelector = function(e){
      var filtering, text;
      console.log('filterSelector1');
      if (e.keyCode < 48 || e.keyCode > 90) {
        return;
      }
      console.log('filterSelector2');
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
      console.log('filterSelector');
      text = $('#selectorInput').val();
      makeSelectorConsole(filtering(text, Main.list).concat(WEB_SEARCH_LIST));
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
      console.log('moveNextCursor');
      x = $('#selectorList .selected').removeClass("selected").next("tr").addClass("selected");
      if (x.length === 0) {
        return $('#selectorList tr').first().addClass("selected");
      }
    };
    constructor.movePrevCursor = function(e){
      var x;
      e.preventDefault();
      console.log('movePrevCursor');
      x = $('#selectorList .selected').removeClass("selected").prev("tr").addClass("selected");
      if (x.length === 0) {
        return $('#selectorList tr').last().addClass("selected");
      }
    };
    constructor.decideSelector = function(e){
      var ref$, type, id, url, query;
      e.preventDefault();
      console.log('decideSelector');
      ref$ = $('#selectorList tr.selected').attr('id').split('-'), type = ref$[0], id = ref$[1];
      url = $('#selectorList tr.selected span.url').text();
      query = $('#selectorInput').val();
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
  HitAHintMode = (function(){
    HitAHintMode.displayName = 'HitAHintMode';
    var prototype = HitAHintMode.prototype, constructor = HitAHintMode;
    HitAHintMode.keydownMap = function(e){
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
      case 'CANCEL':
        return constructor.cancel(e);
      default:
        if (isHitAHintKey(e.keyCode)) {
          return constructor.hitHitKey(e);
        }
      }
    };
    HitAHintMode.keyupMap = function(e){
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
      }
    };
    HitAHintMode.firstKeyCode = null;
    constructor.cancel = function(e){
      constructor.firstKeyCode = null;
      e.preventDefault();
      Main.mode = NeutralMode;
      $(CLICKABLES).removeClass('links');
      return $('.hintKey').remove();
    };
    constructor.hitHitKey = function(e){
      var idx;
      e.preventDefault();
      console.log('hit!: ' + e.keyCode + ', 1stkey: ' + this.firstKeyCode);
      if (this.firstKeyCode === null) {
        return this.firstKeyCode = e.keyCode;
      } else {
        idx = keyCodeToIndex(this.firstKeyCode, e.keyCode);
        console.log('idx: ' + idx);
        try {
          $(CLICKABLES)[idx].click();
          Main.mode = NeutralMode;
          $(CLICKABLES).removeClass('links');
          $('.hintKey').remove();
          return this.firstKeyCode = null;
        } catch (e$) {
          e = e$;
          return this.firstKeyCode = e.keyCode;
        }
      }
    };
    function HitAHintMode(){}
    return HitAHintMode;
  }());
  FormFocusMode = (function(){
    FormFocusMode.displayName = 'FormFocusMode';
    var prototype = FormFocusMode.prototype, constructor = FormFocusMode;
    FormFocusMode.keydownMap = function(e){
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
      return console.log('keydownMap');
    };
    FormFocusMode.keyupMap = function(e){
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
      switch (keyMapper(e.keyCode, Main.ctrl, Main.alt)) {
      case 'MOVE_NEXT_FORM':
        return constructor.focusNextForm(e);
      case 'MOVE_PREV_FORM':
        return constructor.focusPrevForm(e);
      case 'CANCEL':
        return constructor.cancel(e);
      default:
        return function(){
          return console.log('default');
        };
      }
    };
    FormFocusMode.focusNextForm = function(e){
      e.preventDefault();
      console.log('focusNextForm');
      Main.formInputFieldIndex += 1;
      console.log(Main.formInputFieldIndex);
      console.log($(FORM_INPUT_FIELDS));
      console.log($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex));
      if ($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex) != null) {
        return $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus();
      }
    };
    FormFocusMode.focusPrevForm = function(e){
      e.preventDefault();
      console.log('focusPrevForm');
      Main.formInputFieldIndex -= 1;
      console.log(Main.formInputFieldIndex);
      console.log($(FORM_INPUT_FIELDS));
      console.log($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex));
      if ($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex) != null) {
        return $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus();
      }
    };
    constructor.cancel = function(e){
      e.preventDefault();
      Main.mode = NeutralMode;
      return $(':focus').blur();
    };
    function FormFocusMode(){}
    return FormFocusMode;
  }());
  return Main.start();
});
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}