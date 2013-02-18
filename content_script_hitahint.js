var p, FORM_INPUT_FIELDS, _HINT_KEYS, HINT_KEYS, k1, v1, k2, v2, keyCodeToIndex, indexToKeyCode, isHitAHintKey, isFocusingForm, HitAHintMode, FormFocusMode, HitAHint;
p = prelude;
FORM_INPUT_FIELDS = 'input[type="text"], textarea, select';
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
NeutralMode.keyUpFocusForm = function(){
  Main.mode = FormFocusMode;
  Main.formInputFieldIndex = 0;
  return $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus();
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
HitAHint = (function(){
  HitAHint.displayName = 'HitAHint';
  var prototype = HitAHint.prototype, constructor = HitAHint;
  constructor.start = function(){
    var _clickables;
    _clickables = $('a');
    Main.links = _clickables.length === void 8 ? [_clickables] : _clickables;
    if (isFocusingForm()) {
      Main.mode = FormFocusMode;
    }
    $(FORM_INPUT_FIELDS).focus(function(){
      console.log('form focus');
      return Main.mode = FormFocusMode;
    });
    return $(FORM_INPUT_FIELDS).blur(function(){
      console.log('form blur');
      return Main.mode = NeutralMode;
    });
  };
  function HitAHint(){}
  return HitAHint;
}());
HitAHint.start();