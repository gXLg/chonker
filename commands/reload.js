const { spawn } = require("child_process");

async function run(message, e, get_commands){

  const git = spawn("git", ["pull"]);
  await new Promise(res => git.on("exit", res));

  get_commands(message, e);
}

module.exports = {
  "run": run,
  "dep": ["message", "e", "get_commands"],
  "args": [],
  "perm": ["creator"],
  "category": "bot"
};
