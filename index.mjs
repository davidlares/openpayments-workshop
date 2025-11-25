import { OpenPaymentsClientError } from '@interledger/open-payments'
import readline from "readline/promises"
import { client } from './clients.mjs'

;(async () => {
  try {
      // grabbing wallet
      const address = await client.walletAddress.get({
        url: process.env.WALLET_ADDRESS
      })
      console.log('walletAddress', address)

      // grabbing store wallet
      const storeAddress = await client.walletAddress.get({
        url: process.env.STORE_WALLET_ADDRESS
      })
      console.log('storeWalletAddress', storeAddress)

      // incoming payment grant
      const incomingPaymentGrant = await client.grant.request({
          url: storeAddress.authServer
        }, {
          access_token: {
            access: [{
              type: 'incoming-payment',
              actions: ['read', 'create']
            }
          ]
        }
      })
      console.log('incomingPaymentGrant', incomingPaymentGrant)

      // now, let's create the payment itself
      const incomingPayment = await client.incomingPayment.create({
        url: storeAddress.resourceServer,
        accessToken: incomingPaymentGrant.access_token.value
      }, {
        walletAddress: storeAddress.id,
        incomingAmount: {
          assetCode: storeAddress.assetCode,
          assetScale: storeAddress.assetScale,
          value: '5'
        },
        metadata: {
          externalRef: '#INV-0001-DLSHOP',
          description: 'Store purchase for something random'
        }
      })
      console.log('incomingPayment', incomingPayment)

      // generating a quote grant (from the store side)
      const quoteGrant = await client.grant.request({
        url: address.authServer,
      }, {
        access_token: {
          access: [
            {
              type: 'quote',
              actions: ['create', 'read']
            }
          ]
        }
      })
      console.log('quoteGrant', quoteGrant)

      // generating a quote
      const quote = await client.quote.create({
        url: address.resourceServer,
        accessToken: quoteGrant.access_token.value
      }, {
        walletAddress: address.id,
        receiver: incomingPayment.id,
        method: 'ilp'
      })
      console.log('quote', quote)

      // outgoing payment grant
      const outgoingPaymentGrant = await client.grant.request({
        url: address.authServer
      }, {
        access_token: {
          access: [
            {
              type: 'outgoing-payment',
              actions: ['read', 'create', 'list'],
              identifier: address.id,
              limits: {
                debitAmount: {
                  assetCode: quote.debitAmount.assetCode,
                  assetScale: quote.debitAmount.assetScale,
                  value: quote.debitAmount.value,
                }
              }
            }
          ]
        },
        interact: {
          start: ['redirect']
        }
      })

      // printing out the URL
      console.log(outgoingPaymentGrant.interact.redirect);
      await readline.createInterface({ input: process.stdin, output: process.stdout }).question("\nPlease accept grant and press enter...")
      
      // once approved (redirect URL approved)
      const finalizedOutgoingPaymentGrant = await client.grant.continue({
        url: outgoingPaymentGrant.continue.uri,
        accessToken: outgoingPaymentGrant.continue.access_token.value
      })
      console.log('finalizedOutgoingPaymentGrant', finalizedOutgoingPaymentGrant)

      // outgoing payment
      const outgoingPayment = await client.outgoingPayment.create({
        url: address.resourceServer,
        accessToken: finalizedOutgoingPaymentGrant.access_token.value
      }, {
        walletAddress: address.id,
        quoteId: quote.id
      })
      console.log('outgoingPayment', outgoingPayment)

      // done
  } catch (e) {
      if(e instanceof OpenPaymentsClientError) {
        console.log('op description', e.description)
        console.log('op error', e.message)
      } else {
        console.log('e', e)
      }
  }
})()
