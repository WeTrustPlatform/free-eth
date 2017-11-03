/**
 * Script to get free ETH on testnet.
 * Require 2 args
 * faucet: Faucet URL
 *   example: --faucet http://github-faucet.kovan.network/url
 * page: Webpage that contains gist.github.com links which have ETH address
 *   example: --page https://github.com/WeTrustPlatform/lending-circles/wiki/Free-ETH-on-Kovan
 */

const assert = require('assert')
const minimist = require('minimist')
const request = require('request-promise')

const args = minimist(process.argv)
console.log(args)
assert(args.faucet, 'Missing -faucet')
assert(args.page, 'Missing -page')

// parse "https://gist.github.com/sihoang/85984adb40b204e9f611f7349ae50cf5"
// 0: "https://gist.github.com/sihoang/85984adb40b204e9f611f7349ae50cf5"
// 1: "
// 2: https://gist.github.com/sihoang/85984adb40b204e9f611f7349ae50cf5
// 3: "
const regex = /(")(https:\/\/gist.github.com\/.+?)(")/g

request(args.page)
.then(function (htmlString) {
  console.log('Fetching gist links')
  return getGistLinks(htmlString)
})
.then(function (listGist) {
  console.log(JSON.stringify(listGist))
  listGist.forEach(function(val) {
    const option = {
      uri: args.faucet,
      method: 'POST',
      form: {
        address: val
      }
    }
    request(option).then(function (resp) {
      console.log(resp)
    }).catch(function (err) {
      console.log(err)
    })
  })
})
.catch(function (err) {
  throw err
});

const getGistLinks = function (text) {
  let results = []
  let matched = regex.exec(text)
  while (matched) {
    results.push(matched[2])
    matched = regex.exec(text)
  }

  return results
}
