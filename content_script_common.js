var p, KEY_CODE, Main, NeutralMode;
p = prelude;
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
  Main.mode = NeutralMode;
  $(document).keyup(function(e){
    return Main.mode.keyupMap(e);
  });
  return $(document).keydown(function(e){
    return Main.mode.keydownMap(e);
  });
};
Main.start();