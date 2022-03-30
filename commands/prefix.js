function run ( ) { }

module.exports = run
module.exports.admin = true
module.exports.dependencies = [ `
  if ( args.length == 0 ) {
    e
      .setDescription ( "[**ошибка**] Ты не указал префикс для смены" )
      .setFooter ( "Подробнее: \`" + prefix + "help prefix\`" )
    message.reply ( e )
  } else {
    if ( ! data [ idname ]) data [ idname ] = { }
    data [ idname ].prefix = args [ 0 ]
    fs.writeFileSync ( "./database/data.json", JSON.stringify ( data ))
    e.setDescription ( "Готово, префикс бота установлен на \`" + args[0] + "\`" )
    message.reply ( e )
  }
` ]
