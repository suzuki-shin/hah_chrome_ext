var HitAHintNewTabMode;
HitAHintNewTabMode = (function(superclass){
  var prototype = extend$((import$(HitAHintNewTabMode, superclass).displayName = 'HitAHintNewTabMode', HitAHintNewTabMode), superclass).prototype, constructor = HitAHintNewTabMode;
  function HitAHintNewTabMode(){
    HitAHintNewTabMode.superclass.apply(this, arguments);
  }
  return HitAHintNewTabMode;
}(HitAHintMode));
function extend$(sub, sup){
  function fun(){} fun.prototype = (sub.superclass = sup).prototype;
  (sub.prototype = new fun).constructor = sub;
  if (typeof sup.extended == 'function') sup.extended(sub);
  return sub;
}
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}