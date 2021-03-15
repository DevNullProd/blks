# Blocks - A Blockchain Transaction Streamer

This library allows you to stream transaction from any number of blockchains using one standardized interface.

## Supported blockchains

- XRP
- XLM
- Vechain

Support for more blockchains is on the roadmap. Want to see your favourite added sooner... we welcome patches!

## Installation

To install:

```
$ npm i blks --no-optional
```

--no-optional will only install the core library, skipping over additional blockchain-specific dependencies (see below).

### Additional Dependencies:

Depending on which Blockchain you wish to stream, additional dependencies may be required:

For **xrp**:

```
$ npm i ripple-lib
```

For **xlm**:

```
$ npm i ezxlm
```

For **vechain**:

```
$ npm i thorify
$ npm i web3@1.*
```

## Usage

General usage:

```
// Import the library
const {
  stream,
  handle
} = require('./lib/index')

// Handle transactions by printing them to the console
handle('tx', (tx) => {
  console.log(tx)
})

// Stream transactions from the specified blockchains
stream({
  blockchains : [
    'xrp',
    'xlm',
    'vechain'
  ]
})
```

Blockchain specific options may be passed to the *stream* method:

```
stream({
  blockchains : ['xrp'],
  xrp : {server : 'wss://s1.ripple.com:443'}
})
```

Handlers may also be registered on a Blockchain by Blockchain basis:

```
handle('xrp', (tx) => {
  // handle xrp transactions
})

handle('xlm', (tx) => {
  // handle xlm transactions
})
```

## Data

Transactions are converted into a standard format before being forward to handlers. For example:

```
{
  blockchain: 'xrp',
  id: '7D72CB4647FF72A40FC2C1A16CABFC0EB8E4C78799C141C817084AABBB203BC3',
  source: 'rwchA2b36zu2r6CJfEMzPLQ1cmciKFcw9t',
  operations: [ 'OfferCreate' ],
  result: 'tesSUCCESS'
}
```

The fields of this object are as follows:

- **blockchain**: the Blockchain which the transaction was streamed from
- **block**: identifier of the block the transaction appeared in
- **id**: unique identifier of the transaction (usually the hash)
- **source**: source account which issued the transaction
- **operations**: list of operations included in the transaction
- **result**: final result / status of the transaction

## Legaleeze

blks is released under the MIT license

Copyright (C) 2021 - Dev Null Productions
