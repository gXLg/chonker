function get_time ( ) {
  let today = new Date ( )
  let h = today.getHours ( )
  let m = today.getMinutes ( )
  let s = today.getSeconds ( )
  if ( h < 10 ) h = "0" + h
  if ( m < 10 ) m = "0" + m
  if ( s < 10 ) s = "0" + s
  let time = h + ":" + m + ":" + s
  return time
}

/*
function log ( text ) {
  console.log ( "\x1b[34m" + get_time ( ) + "\x1b[m" +
                " | " +  "\x1b[32m" + text + "\x1b[m" )
}
*/
function log ( text ) {
  console.log ( get_time ( ) + " | " + text )
}

function require_ ( module ) {
  delete require.cache [ require.resolve ( module ) ]
  return require ( module )
}

module.exports = { "log" : log,
                   "require_" : require_
                 }
