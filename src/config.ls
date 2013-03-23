DEBUG_MODE = off

log = (x) -> console.log(x)
if DEBUG_MODE is off
  log = (x) -> true

exports.is_debug_mode =-> DEBUG_MODE # for bin/packaging.js


p = prelude

CTRL_KEYCODE = 17
ALT_KEYCODE = 18

