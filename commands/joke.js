const https = require ( "https" )

function run ( message, e ) {

  https.get ( "https://v2.jokeapi.dev/joke/Programming", res => {

    let data = ""
    res.on ( "data", chunk => {
      data += chunk
    }).on ( "end", ( ) => {
      let randomJoke = JSON.parse ( data.toString ( ))

      if ( randomJoke.type == "single" )
        e.setDescription ( "**:nerd: Программисты**\n" + randomJoke.joke )
      else
        e.setDescription ( "**:nerd: Программисты**\n" +
                           randomJoke.setup + "\n||" +
                           randomJoke.delivery + "||" )
      message.reply ( e )
    })

    res.on ( "error", err => {
      console.error ( `Joke error: ${err}` )
      e.setDescription ( "[**ошибка**] Попробуйте позже!" )
      message.reply ( e )
    })
  })
}

module.exports = run
module.exports.dependencies = [ "message", "e" ]

