var DEBUG_MODE;
DEBUG_MODE = false;
if (DEBUG_MODE === false) {
  console.log = function(x){
    return false;
  };
}