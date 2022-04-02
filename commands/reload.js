async function run(message, e, get_commands){
  get_commands(message, e);
}

module.exports = {
  "run": run,
  "dep": ["message", "e", "get_commands"],
  "args": [],
  "perm": ["creator"],
  "category": "bot"
};