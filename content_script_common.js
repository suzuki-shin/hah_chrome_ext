var p, CTRL_KEYCODE, ALT_KEYCODE, KEY, keyMapper, Main, NeutralMode;
p = prelude;
CTRL_KEYCODE = 17;
ALT_KEYCODE = 18;
KEY = DEFAULT_SETTINGS;
if (localStorage.settings) {
  import$(KEY, localStorage.settings);
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
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}