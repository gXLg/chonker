function run(bot, message, c, chan, creator){
  if(c.perm.includes("admin"))
    if(message.author.id != creator &&
         ! message.member.hasPermission("ADMINISTRATOR"))
      return false;
  if(c.perm.includes("creator"))
    if(message.author.id != creator)
      return false;
  if(!chan)
    if(!c.perm.includes("bypass"))
      return false;
  return true;
}

module.exports = run;