var p, CTRL_KEYCODE, ALT_KEYCODE, KEY, keyMapper, Main, NeutralMode;
p = prelude;
CTRL_KEYCODE = 17;
ALT_KEYCODE = 18;
KEY = {
  'START_HITAHINT': {
    CODE: 69,
    CTRL: true,
    ALT: false
  },
  'FOCUS_FORM': {
    CODE: 70,
    CTRL: true,
    ALT: false
  },
  'TOGGLE_SELECTOR': {
    CODE: 186,
    CTRL: true,
    ALT: false
  },
  'CANCEL': {
    CODE: 71,
    CTRL: true,
    ALT: false
  },
  'MOVE_NEXT_SELECTOR_CURSOR': {
    CODE: 40,
    CTRL: false,
    ALT: false
  },
  'MOVE_PREV_SELECTOR_CURSOR': {
    CODE: 38,
    CTRL: false,
    ALT: false
  },
  'MOVE_NEXT_FORM': {
    CODE: 34,
    CTRL: false,
    ALT: false
  },
  'MOVE_PREV_FORM': {
    CODE: 33,
    CTRL: false,
    ALT: false
  },
  'BACK_HISTORY': {
    CODE: 72,
    CTRL: true,
    ALT: false
  }
};
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
      return constructor.keyUpHitAHintStart();
    case 'FOCUS_FORM':
      return constructor.keyUpFocusForm();
    case 'TOGGLE_SELECTOR':
      return constructor.keyUpSelectorToggle();
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
  NeutralMode.keyUpHitAHintStart = function(){
    return false;
  };
  NeutralMode.keyUpFocusForm = function(){
    return false;
  };
  NeutralMode.keyUpSelectorToggle = function(){
    return false;
  };
  NeutralMode.keyUpHistoryBack = function(){
    return history.back();
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
  return $(document).keydown(function(e){
    return Main.mode.keydownMap(e);
  });
};
Main.start();