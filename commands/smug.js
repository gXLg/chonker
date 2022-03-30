const neko_client = require ( "nekos.life" )
const neko = new neko_client ( )

function run ( message, e, args ) {
  neko.sfw.smug ( )
    .then ( json => {
      let author = message.member.nickname || message.author.username
      e
        .setImage ( json.url )
        .setDescription ( author + " глупо лыбится" )
      message.reply ( e )
    })
}

module.exports = run
module.exports.dependencies = [ "message", "e", "args" ]

