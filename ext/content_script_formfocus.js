var FORM_INPUT_FIELDS, FormFocusMode;
FORM_INPUT_FIELDS = 'input[type="text"]:not("#selectorInput"), textarea, select';
FormFocusMode = (function(){
  FormFocusMode.displayName = 'FormFocusMode';
  var prototype = FormFocusMode.prototype, constructor = FormFocusMode;
  FormFocusMode.keydownMap = function(e, keyMapper){
    log('mode: ' + Main.mode);
    log('keyCode: ' + e.keyCode);
    log('Ctrl: ' + Main.ctrl);
    log({
      CODE: e.keyCode,
      CTRL: Main.ctrl,
      ALT: Main.alt,
      SHIFT: Main.shift
    });
    if (Main.changeModKey(true, e.keyCode)) {
      return;
    }
    return log('keydownMap');
  };
  FormFocusMode.keyupMap = function(e, keyMapper, makeSelectorConsole, _){
    log('mode: ' + Main.mode);
    log('keyCode: ' + e.keyCode);
    log('Ctrl: ' + Main.ctrl);
    log({
      CODE: e.keyCode,
      CTRL: Main.ctrl,
      ALT: Main.alt,
      SHIFT: Main.shift
    });
    if (Main.changeModKey(false, e.keyCode)) {
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
        return log('default');
      };
    }
  };
  FormFocusMode.focusNextForm = function(e){
    e.preventDefault();
    log('focusNextForm');
    Main.formInputFieldIndex += 1;
    log(Main.formInputFieldIndex);
    log($(FORM_INPUT_FIELDS));
    log($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex));
    if ($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex) != null) {
      return $(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex).focus();
    }
  };
  FormFocusMode.focusPrevForm = function(e){
    e.preventDefault();
    log('focusPrevForm');
    Main.formInputFieldIndex -= 1;
    log(Main.formInputFieldIndex);
    log($(FORM_INPUT_FIELDS));
    log($(FORM_INPUT_FIELDS).eq(Main.formInputFieldIndex));
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