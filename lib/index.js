var handlers = {}

function handle(target, callback){
  if(!handlers[target])
    handlers[target] = []

  handlers[target].push(callback)
}

function stream(opts){
  if(!opts.blockchains)
    throw "must specify blockchains";

  // Deep copy opts locally
  var local_opts = JSON.parse(JSON.stringify(opts))

  // Iterate over specified blockchains
  for(var b = 0; b < opts.blockchains.length; b += 1){
    const blockchain = local_opts.blockchains[b];
    const blockchain_opts = local_opts[blockchain] || {}

    // Copy handlers to blockchain opts
    blockchain_opts.handlers = handlers;

    // Load blockchain module and stream
    const module = require('./blockchains/' + blockchain);
    module.stream(blockchain_opts)
  }
}

module.exports = {
  stream,
  handle
}
