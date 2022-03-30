function run ( ) { }

module.exports = run
module.exports.creator = true
module.exports.dependencies = [ `
  commands = get_commands ( )
  data = get_data ( )
  e.setDescription ( "Готово" )
  message.reply ( e )
` ]
