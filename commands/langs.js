const fs = require ( "fs" )
const extensions = JSON.parse ( fs.readFileSync ( "./configs/extensions.json" ))

function run ( message, e ) {
  let langs = [ ]
  for ( let i in extensions ) langs.push ( i )
  e.setDescription ( langs.sort ( ).join ( ", " ))
  message.reply ( e )
}

module.exports = run
module.exports.dependencies = [ "message", "e" ]
