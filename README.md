# ChainFundraiser-Donation-DApp

This Decentralized application (DAPP) demonstrates an application for people to get donations for their projects or humanity use cases.

-Images of the project: ![Images](images/)

##

Back-end parts (`solidity`) are located in `web3` folder.
Front-end parts are located in `client` folder.



# Starting the frontend:

Take steps as below:
- 0) deploy core smart contract ( `ChainFundraiser.sol` file) from `web3` folder on your desire network(default is Goerli). Explanation is located at `web3` folder.
- 1) `cd client`
- 2) `npm install`
- 3) to start the frontend: `npm run dev`
- 4) easily work with the platform

* Note: In case facing error of __*to high nonce*__ (on `localhost` network), first reset your `Metamask` as stated below, and then try again:
- Open __Metamask__ > __Settings__ > __Advanced__ > __Clear activity and nonce data__ > click on __`Clear activity tab data`__ button
