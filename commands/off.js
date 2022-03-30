function run ( ) { }

module.exports = run
module.exports.creator = true
module.exports.dependencies = [ `
  ( async ( ) => {
    clearInterval ( interval )
    clearInterval ( cinter )
    e.setDescription ( ":wave: Отключаюсь!" )
    await message.reply ( e )
    bot.destroy ( )
    process.exit ( )
  }) ( )
` ]
