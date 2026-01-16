## OpenPayments Node workshop

This script demonstrates a complete Open Payments flow using the Interledger protocol. It automates the process of requesting permissions (grants), setting up an incoming payment at a destination (store), quoting the cost, and finally executing an outgoing payment from a sender's wallet.

This project demonstrates how to use the `@interledger/open-payments` SDK to perform an end-to-end payment flow between two wallet addresses.

## Overview

The script automates the communication between a Sender and a Receiver (Store) using the Open Payments standard. It follows these high-level steps:

1. Wallet Discovery: Fetches details for both the sender and the store wallets.s
2. Incoming Payment Setup: Requests a grant and creates an "Incoming Payment" resource on the store's wallet.
3. Quoting: Creates a quote on the sender's wallet to calculate the exchange rate and fees for the specific incoming payment.
4. Grant Authorization: Requests an outgoing payment grant, requiring manual user interaction via a redirect URL.
5. Execution: Finalizes the grant after approval and executes the payment.

## Environment Variables

You'll need to create your own .env file

We have `WALLET_ADDRESS` as the Open Payments URL for the Sender wallet, `STORE_WALLET_ADDRESS` as the Open Payments URL for the Receiver wallet and the `PRIVATE_KEY_PATH` that should point the path of your `.pem` file required to set up your test wallet.

## Usage 

Run `index.mjs` 

## Test wallet used

Check: [Interledger Test Wallet](https://wallet.interledger-test.dev)

## Credits
[David Lares S](https://davidlares.com)

## License
[MIT](https://opensource.org/licenses/MIT)