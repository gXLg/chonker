const os = require ( "os" )

function run ( message, e, bot, ds, data, done ) {

  let t = ""

  let now = new Date ( )
  let dat =  `> Регистрация: <t:1585870173:R>\n` +
             `> Время запуска: <t:${ Math.floor ( ( now - bot.uptime ) / 1000 )}:R>\n` +
             `> Верифицирован: <t:1633367880:R>`
  t += "**:date: Даты**\n" + dat + "\n"

  let used = process.memoryUsage ( ).rss
  let memo = os.totalmem ( )
  let perc = ( 100 * used / memo ).toFixed ( 2 )
  let stt = `> Команд выполнено: ${done}\n` +
            `> RAM: ${perc}% (${ parseInt ( used / 1048576 )}/${ parseInt ( memo / 1048576 )} MB)\n` +
            `> Пинг: ${ bot.ws.ping } ms`
  t += "**:bar_chart: Статистика**\n" + stt + "\n"

  let users = 0
  let guilds = bot.guilds.cache.size
  bot.guilds.cache.forEach ( guild => users += guild.memberCount )
  let cuspr = 0
  let enlan = 0
  for ( let i in data ) {
    if ( data [ i ].lang == "en" ) enlan ++
    if ( data [ i ].prefix && ( data [ i ].prefix != ">_" )) cuspr ++
  }
  let se = ( guilds % 10 == 1 ) && ( guilds % 100 != 11 ) ? "е" : "ах"
  let u
  if ( ( users % 100 < 20 ) && ( users % 100 > 10 )) u = "ей"
  else if ( ( users % 10 < 5 ) && ( users % 10 > 1 )) u = "я"
  else if ( users % 10 == 1 ) u = "ь"
  else u = "ей"
  let sc
  if ( ( cuspr % 100 < 20 ) && ( cuspr % 100 > 10 )) sc = "ов используют"
  else if ( ( cuspr % 10 < 5 ) && ( cuspr % 10 > 1 )) sc = "а используют"
  else if ( cuspr % 10 == 1 ) sc = " использует"
  else sc = "ов используют"
  let sn
  if ( ( enlan % 100 < 20 ) && ( enlan % 100 > 10 )) sn = "ов используют"
  else if ( ( enlan % 10 < 5 ) && ( enlan % 10 > 1 )) sn = "а используют"
  else if ( enlan % 10 == 1 ) sn = " использует"
  else sn = "ов используют"
  let gld = `> ${users} пользовател${u} на ${guilds} сервер${se}\n` +
            `> ${cuspr} сервер${sc} собственный префикс\n` +
            `> ${enlan} сервер${sn} бота на английском`
  t += "**:house: Сервера**\n" + gld + "\n"

  let sst = `> Язык: Javascript, NodeJS (${ process.version })\n` +
            `> Библиотека: discord.js (${ ds.version })\n` +
            `> Платформа: ${ process.platform } ${ process.arch }`
  t += "**:rocket: Система**\n" + sst

  e.setDescription ( t )
  message.reply ( e )
}

module.exports = run
module.exports.dependencies = [ "message", "e", "bot", "ds", "data", "done" ]
