var DEBUG_MODE, log, p, CTRL_KEYCODE, ALT_KEYCODE;
DEBUG_MODE = false;
log = function(x){
  return console.log(x);
};
if (DEBUG_MODE === false) {
  log = function(x){
    return true;
  };
}
exports.is_debug_mode = function(){
  return DEBUG_MODE;
};
p = prelude;
CTRL_KEYCODE = 17;
ALT_KEYCODE = 18;