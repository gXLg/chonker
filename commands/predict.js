function run ( ) { }

module.exports = run
module.exports.admin = true
module.exports.dependencies = [ `
  switch ( args [ 0 ]) {
    case "off" :
      if(!(idname in data)) data[idname] = { }
      data [ idname ].predict = false;
      fs.writeFileSync ( "./database/data.json", JSON.stringify ( data ))
      e.setDescription ( "Готово, корректировка отключена" );
      message.reply ( e )
      break
    case "on" :
      if(!(idname in data)) data[idname] = { }
      data [ idname ].predict = true;
      fs.writeFileSync ( "./database/data.json", JSON.stringify ( data ))
      e.setDescription ( "Готово, корректировка включена" );
      message.reply ( e )
      break
    default:
      e.setDescription ( "[**error**] Неверный метод!" )
      e.setFooter ( "Подробнее: \`" + prefix + "help predict\`" )
      message.reply ( e )
  }
` ]
