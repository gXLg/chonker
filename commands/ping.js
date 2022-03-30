function run ( message, e, bot ) {
  let time = Math.round ( bot.ws.ping )
  e.setDescription ( "**:stopwatch: Pong!**\n> " +
                     "Задержка: " + time + " мс" )
  message.reply ( e )
}

module.exports = run
module.exports.dependencies = [ "message", "e", "bot" ]
