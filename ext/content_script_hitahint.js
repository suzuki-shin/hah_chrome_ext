var CLICKABLES, _HINT_KEYS, HINT_KEYS, k1, v1, k2, v2, keyCodeToIndex, indexToKeyCode, isHitAHintKey, HitAHintMode;
CLICKABLES = "a[href],input:not([type=hidden]),textarea,select,*[onclick],button";
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
HitAHintMode = (function(){
  HitAHintMode.displayName = 'HitAHintMode';
  var prototype = HitAHintMode.prototype, constructor = HitAHintMode;
  HitAHintMode.keydownMap = function(e, keyMapper){
    log('mode: ' + Main.mode);
    log('keyCode: ' + e.keyCode);
    log('Ctrl: ' + Main.ctrl);
    log({
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
        return constructor.hitHintKey(e);
      }
    }
  };
  HitAHintMode.keyupMap = function(e, keyMapper, makeSelectorConsole, _){
    log('mode: ' + Main.mode);
    log('keyCode: ' + e.keyCode);
    log('Ctrl: ' + Main.ctrl);
    log({
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
    $(CLICKABLES).removeClass('links_newtab');
    return $('.hintKey').remove();
  };
  constructor.hitHintKey = function(e){
    var idx;
    e.preventDefault();
    log('hit!: ' + e.keyCode + ', 1stkey: ' + this.firstKeyCode);
    if (this.firstKeyCode === null) {
      return this.firstKeyCode = e.keyCode;
    } else {
      idx = keyCodeToIndex(this.firstKeyCode, e.keyCode);
      log('idx: ' + idx);
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