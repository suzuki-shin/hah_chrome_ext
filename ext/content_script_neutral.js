var NeutralMode;
NeutralMode = (function(){
  NeutralMode.displayName = 'NeutralMode';
  var prototype = NeutralMode.prototype, constructor = NeutralMode;
  NeutralMode.keydownMap = function(e, keyMapper){
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
    case 'START_HITAHINT':
      return constructor.startHah();
    case 'START_HITAHINT_NEWTAB':
      return constructor.startHahNewTab();
    case 'FOCUS_FORM':
      return constructor.focusForm(e);
    case 'TOGGLE_SELECTOR':
      return constructor.toggleSelector();
    case 'CANCEL':
      return constructor.cancel(e);
    default:
      return function(){
        return log('default');
      };
    }
  };
  NeutralMode.keyupMap = function(e, keyMapper, makeSelectorConsole, _){
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
  constructor.backHistory = function(){
    return history.back();
  };
  constructor.toggleSelector = function(){
    Main.mode = SelectorMode;
    $('#selectorConsole').show();
    return $('#selectorInput').focus();
  };
  constructor.focusForm = function(e){
    e.preventDefault();
    Main.mode = FormFocusMode;
    Main.formInputFieldIndex = 0;
    return $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus();
  };
  constructor.startHah = function(){
    Main.mode = HitAHintMode;
    constructor._startHaH('links');
    return $('.links').attr("target", "");
  };
  constructor.startHahNewTab = function(){
    Main.mode = HitAHintNewTabMode;
    constructor._startHaH('links_newtab');
    return $('.links_newtab').attr("target", "_blank");
  };
  constructor._startHaH = function(style_cls){
    return $(CLICKABLES).addClass(style_cls).html(function(i, oldHtml){
      if (HINT_KEYS[indexToKeyCode(i)] != null) {
        return '<div class="hintKey">' + HINT_KEYS[indexToKeyCode(i)] + '</div> ' + oldHtml;
      } else {
        return oldHtml;
      }
    });
  };
  constructor.cancel = function(e){
    e.preventDefault();
    Main.mode = NeutralMode;
    $('#selectorConsole').hide();
    $(':focus').blur();
    HitAHintMode.firstKeyCode = null;
    $(CLICKABLES).removeClass('links');
    $(CLICKABLES).removeClass('links_newtab');
    return $('.hintKey').remove();
  };
  function NeutralMode(){}
  return NeutralMode;
}());