const {
  stream,
  handle
} = require('./lib/index')

handle('tx', (tx) => {
  console.log(tx)
})

stream({
  blockchains : [
    'xrp',
    'xlm',
    'vechain'
  ]
})
