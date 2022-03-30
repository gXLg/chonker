const https = require ( "https" )
const zlib = require ( "zlib" )
const decode = require ( "html-entities" ).decode

function run ( message, prefix, e, args ) {

  /*
  if ( message.author.id != "557260090621558805" ) {
    message.reply ( "команда в разработке" )
    return
  }
  */

  if ( args.length == 0 ) {
    e
      .setDescription ( "[**ошибка**] Ты не указал параметры поиска" )
      .setFooter ( "Подробней: `" + prefix + "help stack`" )
    message.reply ( e )
    return
  }

  https.get ( "https://api.stackexchange.com/2.3/search?page=1&pagesize=10" +
              "&order=desc&sort=activity&intitle=" +
              encodeURIComponent ( args.join ( " " )) +
              "&site=stackoverflow", res => {

    let buffer = [ ]
    let gunzip = zlib.createGunzip ( )
    res.pipe ( gunzip )

    gunzip.on ( "data", chunk => {
      buffer.push ( chunk )
    }).on ( "end", ( ) => {
      let questions = JSON.parse ( buffer.join ( "" ))
      let a = ""
      if ( ! questions.items ) {
        message.reply ( "[**ошибка**] Что-то пошло не так...\n" )
        return
      }
      questions.items.forEach ( q => {
        a +=( q.is_answered ? ":white_check_mark:" : ":no_entry_sign:" ) +
        " [" + decode ( q.title ) + "](" + q.link + ")" +
        "\nVotes: " + q.score + ", answers: " + q.answer_count +
        "\n\n"
      })
      if ( questions.has_more ) e.setFooter ( "Топ 10 результатов" )
      if ( ! a ) a = "Результаты отсутсвуют"
      e.setDescription ( a )
      message.reply ( e )
    }).on ( "error", err => {
      console.error ( `Stack error: ${err}` )
      e.setDescription ( "[**ошибка**] Попробуйте позже!" )
      message.reply ( e )
    })
  })
}

module.exports = run
module.exports.dependencies = [ "message", "prefix", "e", "args" ]
