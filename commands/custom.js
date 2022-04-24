

async function run(message, prefix, e, args){
  if(message.author.id != "557260090621558805"){
    e.setDescription("Эта команда находится в разработке!");
    message.reply({ "embeds": [e] });
    return;
  }
  let output = "";
  e.setDescription("```\n \n```");
  const msg = await message.reply({ "embeds": [e] });

  const code = args[0].split("\n").filter(l => !!l);
  for(const line of code){
    output += line;
    e.setDescription(output);
    await msg.edit({ "embeds": [e] });
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