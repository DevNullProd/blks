/* XLM adapter module */

var StellarSdk = require('stellar-sdk')
var ezxlm = require('ezxlm')

// Transform XLM transaction into common format
function transform(tx){
  const simplified = ezxlm.simplify(tx);
  const operations = simplified.envelope.tx.operations;
  return {
    blockchain : 'xlm',
    block : tx.ledger_attr,
    id : tx.id,
    source : simplified.envelope.tx.sourceAccount,
    operations : operations.map((o) => o._type),
    result : simplified.result.result._type
  }
}

// Begin streaming XLM transactions
function stream(opts){
  // Dispatch to tx and xlm handlers
  const handlers = (opts.handlers.tx || []).concat(opts.handlers.xlm || []);

  // Initialize SDK
  var server = new StellarSdk.Server(opts.server || 'https://horizon.stellar.org');

  // Start streaming transactions
  server.transactions()
     .cursor('now')
     .stream({
       onmessage: (tx) => {
         // Transform transactions and forward to handlers
         const transformed = transform(tx);
         for(var h = 0; h < handlers.length; h += 1)
           handlers[h](transformed);
       }
     })
}

///

module.exports = {
  stream
}
