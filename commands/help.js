async function run(message, prefix, bot, e, args){

  const help = {
    "help" : [ "Помощь с командами.",
               prefix + "help <команда>" ],
    "commands" : [ "Получить список команд" ],
    "stat" : [ "Узнать статистику бота" ],
    "reload" : [ "Перезагрузка бота, только для создателя" ],
    "do" : [ "Обработать код\nЧтобы получить список языков, используй `" + prefix + "langs`",
             prefix + "do <язык> <аргументы> [новая строка]\n```\ncode.to ( execute )\n```\n\n" + prefix + "do <язык> <аргументы> [прикреплённый файл с кодом]",
             prefix + "do JavaScript\n```js\nconsole.log ( \"Hello World!\" )\n```",
             "Сеть: отключена\nКоличество процессов: 200\nЯдер: 1\nВиртуальной памяти: 620MB\nОткрытых файлов: 69\nВремя на исполнение: 30сек\nРазмер окружающей среды: 2MB\nДанные хранятся только 2 часа"
    ],
    "ping" : [ "Пингует хост бота и отправляет его задержку" ],
    "clear" : [ "Очистить свою окружающую среду" ],
    "in" : [ "Написать в stdin запущенного процесса",
             prefix + "in [новая строка]\n<текст>",
             prefix + "in\nинпут тут"
         ],
    "langs" : [ "Получить список поддерживаемых языков" ],
    "off" : [ "Выключить бота, только для создателя" ],
    "joke" : [ "Случайная шутка о программировании" ],
    "stack" : [ "Обыскать Stackoverflow", prefix + "stack <поиск>", prefix + "stack asm invalid register" ],
    "lang" : [ "Сменить язык бота, только для админов",
               prefix + "lang - список языков\n" + prefix + "lang <язык> - сменить язык" ],
    "hex" : [ "Узнать информацию о цвете",
              prefix + "hex <цвет в формате hex>",
              prefix + "hex #45FFEE" ],
    "prefix" : [ "Сменить префикс бота, только для админов",
                 prefix + "prefix <префикс>",
                 prefix + "prefix c!" ],
    "chan" : [ "Ограничить бота до одного канала, команда доступна и вне этого канала на случай его удаления, только для админов",
               prefix + "chan - получить выбранный канал\n\n",
               prefix + "chan <id канала>\n\n" +
               prefix + "chan <упоминание канала>\n\n" +
               prefix + "chan none - удалить фильтр\n\n" +
               prefix + "chan here - использовать данный канал",
               prefix + "chan 866352585971466250" ],
    "raw" : [ "Получить сырое содержание сообщения в доступном для копирования виде",
              prefix + "raw <id сообщения в том же канале>",
              prefix + "raw 896327117673988117" ],
    "baka" : [ "Назвать кого-нибудь идиотом",
               prefix + "baka\n\n" +
               prefix + "baka <id пользователя>\n\n" +
               prefix + "baka <упоминание пользователя>" ],
    "cuddle" : [ "Пожмякаться с кем-нибудь",
                 prefix + "cuddle <id пользователя>\n\n" +
                 prefix + "cuddle <упоминание пользователя>" ],
    "feed" : [ "Покормить кого-нибудь",
               prefix + "feed <id пользователя>\n\n" +
               prefix + "feed <упоминание пользователя>" ],
    "hug" : [ "Обнять кого-нибудь",
              prefix + "hug <id пользователя>\n\n" +
              prefix + "hug <упоминание пользователя>" ],
    "kiss" : [ "Поцеловать кого-нибудь",
               prefix + "kiss <id пользователя>\n\n" +
               prefix + "kiss <упоминание пользователя>" ],
    "pat" : [ "Погладить кого-нибудь",
              prefix + "pat <id пользователя>\n\n" +
              prefix + "pat <упоминание пользователя>" ],
    "poke" : [ "Тыкнуть кого-нибудь",
               prefix + "poke <id пользователя>\n\n" +
               prefix + "poke <упоминание пользователя>" ],
    "slap" : [ "Шлёпнуть кого-нибудь",
               prefix + "slap <id пользователя>\n\n" +
               prefix + "slap <упоминание пользователя>" ],
    "tickle" : [ "Пощекотать кого-нибудь",
               prefix + "tickle <id пользователя>\n\n" +
               prefix + "tickle <упоминание пользователя>" ],
    "smug" : [ "Ухмылка :]" ],
    "predict" : [ "Включить или выключить предсказывание команд",
                  prefix + "predict on/off" ]
  };

  const txt = args[0];
  if(txt)
    if(help[txt]){
      e.setTitle("Команда " + txt)
      let t = ""
      t += "**Описание**\n> " + help[txt][0].split("\n").join("\n> ");
      if(help[txt][1])
        t += "\n**Использование**\n> " + help[txt][1].split("\n").join("\n> ");
      if(help[txt][2])
        t +="\n**Пример**\n> " + help[txt][2].split("\n").join("\n> ");
      if(help[txt][3])
        t += "\n**Ограничения**\n> " + help[txt][3].split("\n").join("\n> ");
      e.setDescription(t);
    } else
      e.setDescription("[**ошибка**] Для этой команды помощи нет, либо эта команда не существует!");
  else {
    e
      .setThumbnail(bot.user.displayAvatarURL({ "size": 512 }))
      .setTitle("чонкер");
    let t = "";
    t += "**:innocent: Обо мне**\n> Я бот для твоих программировальных штучек\n" +
         "> Ты работаешь с телефона либо просто хочешь похвастаться своим кодом?\n" +
         "> Круто, ведь это именно то, для чего я был создан\n";
    t += "**:bulb: Мини гайд**\n> Для начала ознакомься с командой \\`" + prefix + "do\\`\n" +
         "> Чтобы писать в stdin процесса, используй \\`" + prefix + "in\\`\n" +
         "> Получи больше информации с \\`" + prefix + "help <команда>\\` и список команд с `" + prefix + "commands`\n" +
         "> Префикс бота можно поменять командой \\`" + prefix + "prefix\\`\n" +
         "> Альтернативно, ботом можно пользоваться, пинганув его, и написав команду после пинга\n";
    t += "**:scroll: Ссылки**\n> Бот создан `sas24#9133` для [irrational](https://discord.gg/SpkFUDZv2P)\n" +
         "> [Пригласить меня](https://discord.com/api/oauth2/authorize?client_id=695414653794254858&permissions=7577&scope=bot) к тебе на сервер\n" +
         "> [Сервер поддержки](https://discord.gg/CfveTxCvwJ)\n" +
         "> [Исходники бота](https://github.com/gXLg/chonker)\n" +
         "> Не стесняйся оценить бота на [мониторинге](https://bots.server-discord.com/695414653794254858)\n" +
         "> Дизайн инспирирован SCrow";
    e.setDescription(t);
  }
  message.reply({ "embeds": [e] });
}

module.exports = {
  "run": run,
  "dep": [
    "message", "prefix", "bot", "e", "args"
  ],
  "args": [
    [
      [/\w+/, arg => arg.toLowerCase()],
      [new RegExp(), arg => false]
    ]
  ],
  "perm": [],
  "category": "bot"
};