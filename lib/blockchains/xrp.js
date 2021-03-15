/* XRP adapter module */

const rpi = require('ripple-lib').RippleAPI;

// Transform XRP transaction into common format
function transform(tx){
  return {
    blockchain : 'xrp',
    block : tx.ledger_index,
    id : tx.transaction.hash,
    source : tx.transaction.Account,
    operations : [tx.transaction.TransactionType],
    result : tx.meta.TransactionResult
  }
}

// Begin streaming XRP transactions
function stream(opts){
  // Dispatch to tx and xrp handlers
  const handlers = (opts.handlers.tx || []).concat(opts.handlers.xrp || []);

  // Initialize API
  const api = new rpi({
    server: opts.server || "wss://s2.ripple.com:443"
  });

  // Connect to server
  api.connect().then(() => {
    // Transform transactions and forward to handlers
    api.connection.on('transaction', (tx) => {
      const transformed = transform(tx);
      for(var h = 0; h < handlers.length; h += 1)
        handlers[h](transformed);
    })

    // Subscribe to transactions
    api.request('subscribe', {
      streams : ['transactions']
    }).catch(error => {
      // TODO: handle `error`
    })
  })
}

///

module.exports = {
  stream
}
