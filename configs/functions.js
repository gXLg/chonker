function get_time(){
  let today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  if(h < 10) h = "0" + h;
  if(m < 10) m = "0" + m;
  if(s < 10) s = "0" + s;
  let time = h + ":" + m + ":" + s;
  return time;
}

function log(text){
  console.log(get_time() + " | " + text);
}

module.exports = { log };
