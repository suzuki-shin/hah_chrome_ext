DEBUG_MODE = off

log = (x) -> console.log(x)
if DEBUG_MODE is off
  log = (x) -> true

