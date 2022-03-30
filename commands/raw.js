async function run ( message, prefix, e, args ) {

  let id = args [ 0 ]
  if ( ! id ) {
    e
      .setDescription ( "[**ошибка**] Ты не указал сообщение!" )
      .setFooter ( "Подробней: `" + prefix + "help raw`" )
    message.reply ( e )
    return
  }

  if ( ! id.match ( /^\d+$/ )) {
    e
      .setDescription ( "[**ошибка**] Неверный формат!" )
      .setFooter ( "Подробней: `" + prefix + "help raw`" )
    message.reply ( e )
    return
  }

  let msg = await message.channel.messages.fetch ( id ).catch ( ( ) => {
    e.setDescription ( "[**ошибка**] Данное сообщение не существует, либо мне не доступно!" );
    message.reply ( e )
    return
  })
  if(!msg) return;
  if ( ! msg.content ) {
    e
      .setDescription ( "[**ошибка**] Сообщение имеет пустое содержание!" )
      .setFooter ( "Подробней: `" + prefix + "help raw`" )
    message.reply ( e )
    return
  }

  let content = msg.content
  for ( let i of "*_~`|@<>" )
    content = content.split ( i ).join ( "\\" + i )

  e.setDescription ( content )
  message.reply ( e )
}

module.exports = run
module.exports.dependencies = [ "message", "prefix", "e", "args" ]

