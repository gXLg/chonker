const neko_client = require ( "nekos.life" )
const neko = new neko_client ( )

function run ( message, e, args, prefix ) {
  neko.sfw.kiss ( )
    .then ( json => {
      let author = message.member.nickname || message.author.username
      let id
      let mentioned = ""
      if ( ! args [ 0 ]) {
        e
          .setDescription ( "[**ошибка**] Нужно указать пользователя" )
          .setFooter ( "Подробнее: `" + prefix + "help kiss`" )
        message.reply ( e )
        return
      } else if ( args [ 0 ].match ( /^<@\d+>$/ ))
        id = args [ 0 ].slice ( 2, -1 )
      else if ( args [ 0 ].match ( /^<@!\d+>$/ ))
        id = args [ 0 ].slice ( 3, -1 )
      else if ( args [ 0 ].match ( /^\d+$/ ))
        id = args [ 0 ]
      else {
        e
          .setDescription ( "[**ошибка**] Неверный формат" )
          .setFooter ( "Подробнее: `" + prefix + "help kiss`" )
        message.reply ( e )
        return
      }
      if ( id ) {
        mentioned = message.guild.member ( id )
        if ( ! mentioned ) {
          e.setDescription ( "[**ошибка**] Этот пользователь не существует либо мне недоступен" )
          message.reply ( e )
          return
        }
        mentioned = mentioned.nickname || mentioned.user.username
        if ( ( mentioned == author ) && ( message.author.id == id ))
          mentioned = "себя"

        mentioned = " целует " + mentioned
      }
      e
        .setImage ( json.url )
        .setDescription ( author + mentioned )
      message.reply ( e )
    })
}

module.exports = run
module.exports.dependencies = [ "message", "e", "args", "prefix" ]
