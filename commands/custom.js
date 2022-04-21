async function run(message, prefix, e, args){
  if(message.author.id != "557260090621558805"){
    e.setDescription("Эта команда находится в разработке!");
    message.reply({ "embeds": [e] });
    return;
  }
}

module.exports = {
  "run": run,
  "dep": [
    "message", "prefix", "e", "args"
  ],
  "args": [
    [
      [/`{3}\w*\n?[\S\s]+?\n?`{3}/m, arg => arg.slice(arg.split(/\s/)[0].length, - 3).trim()]
    ]
  ],
  "perm": [],
  "category": "server"
};