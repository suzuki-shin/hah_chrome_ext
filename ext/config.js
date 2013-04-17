var DEBUG_MODE, log;
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