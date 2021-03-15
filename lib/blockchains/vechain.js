/* Vechain adapter module */

const { thorify } = require("thorify");
const Web3 = require("web3");

// Transform Vechain transaction into common format
function transform(tx){
  return {
    blockchain : 'vechain',
    block : tx.blockNumber, // or blockRef (?)
    id : tx.id,
    source : tx.origin,
    //operations : [], // TODO: operations from clauses (transfers, contract calls)
    result : null,
  }
}

// Begin streaming Vechain transactions
function stream(opts){
  // Dispatch to tx and vechain handlers
  const handlers = (opts.handlers.tx || []).concat(opts.handlers.vechain || []);

  // Connect to server
  const web3 = thorify(new Web3(), opts.source || 'https://vethor-node.vechain.com/doc/swagger-ui/');

  // Subscribe to blocks
  const subscription = web3.eth.subscribe('newBlockHeaders')

  // Process transactions
  subscription.on('data', (data)=>{
    if(data.transactions.length == 0) return;

    // Retrieve transaction
    web3.eth.getTransaction(data.transactions[0]).then(tx => {
      // Transform transactions and forward to handlers
      const transformed = transform(tx);
      for(var h = 0; h < handlers.length; h += 1)
        handlers[h](transformed);
    })
  })
}

///

module.exports = {
  stream
}
