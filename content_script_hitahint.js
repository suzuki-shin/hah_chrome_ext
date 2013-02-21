var p, FORM_INPUT_FIELDS, CLICKABLES, _HINT_KEYS, HINT_KEYS, k1, v1, k2, v2, keyCodeToIndex, indexToKeyCode, isHitAHintKey, isFocusingForm, HitAHintMode, FormFocusMode, HitAHint;
p = prelude;
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
      constructor.keyUpCancel(e);
    }
    if (isHitAHintKey(e.keyCode)) {
      return constructor.keyUpHintKey(e);
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
  HitAHintMode.keyUpCancel = function(e){
    e.preventDefault();
    Main.mode = NeutralMode;
    $(CLICKABLES).removeClass('links');
    $('.hintKey').remove();
    return constructor.firstKeyCode = null;
  };
  HitAHintMode.keyUpHintKey = function(e){
    var idx;
    e.preventDefault();
    console.log('hit!: ' + e.keyCode + ', 1stkey: ' + this.firstKeyCode);
    if (this.firstKeyCode === null) {
      return this.firstKeyCode = e.keyCode;
    } else {
      idx = keyCodeToIndex(this.firstKeyCode, e.keyCode);
      console.log('idx: ' + idx);
      $(CLICKABLES)[idx].click();
      Main.mode = NeutralMode;
      $(CLICKABLES).removeClass('links');
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
      return constructor.keyUpFormNext(e);
    case 'MOVE_PREV_FORM':
      return constructor.keyUpFormPrev(e);
    case 'CANCEL':
      return constructor.keyUpCancel(e);
    default:
      return function(){
        return console.log('default');
      };
    }
  };
  FormFocusMode.keyUpFormNext = function(e){
    e.preventDefault();
    console.log('keyUpFormNext');
    Main.formInputFieldIndex += 1;
    console.log(Main.formInputFieldIndex);
    console.log($(FORM_INPUT_FIELDS));
    console.log($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex));
    if ($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex) != null) {
      return $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus();
    }
  };
  FormFocusMode.keyUpFormPrev = function(e){
    e.preventDefault();
    console.log('keyUpFormPrev');
    Main.formInputFieldIndex -= 1;
    console.log(Main.formInputFieldIndex);
    console.log($(FORM_INPUT_FIELDS));
    console.log($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex));
    if ($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex) != null) {
      return $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus();
    }
  };
  FormFocusMode.keyUpCancel = function(e){
    e.preventDefault();
    Main.mode = NeutralMode;
    return $(':focus').blur();
  };
  function FormFocusMode(){}
  return FormFocusMode;
}());
NeutralMode.keyUpFocusForm = function(){
  Main.mode = FormFocusMode;
  Main.formInputFieldIndex = 0;
  return $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus();
};
NeutralMode.keyUpHitAHintStart = function(){
  Main.mode = HitAHintMode;
  return $(CLICKABLES).addClass('links').html(function(i, oldHtml){
    if (HINT_KEYS[indexToKeyCode(i)] != null) {
      return '<div class="hintKey">' + HINT_KEYS[indexToKeyCode(i)] + '</div> ' + oldHtml;
    } else {
      return oldHtml;
    }
  });
};
HitAHint = (function(){
  HitAHint.displayName = 'HitAHint';
  var prototype = HitAHint.prototype, constructor = HitAHint;
  constructor.start = function(){
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
  function HitAHint(){}
  return HitAHint;
}());
HitAHint.start();