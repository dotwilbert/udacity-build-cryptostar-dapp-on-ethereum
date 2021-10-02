# ND1309 C2 Ethereum Smart Contracts, Tokens and Dapps - Project Starter 
**PROJECT: Decentralized Star Notary Service Project** - For this project, you will create a DApp by adding functionality with your smart contract and deploy it on the public testnet.

### ToDo
This Starter Code has already implemented the functionalities you implemented in the StarNotary (Version 2) exercise, and have comments in all the files you need to implement your tasks.



### Dependencies
For this project, you will need to have:
1. **Node and NPM** installed - NPM is distributed with [Node.js](https://www.npmjs.com/get-npm)
```bash
# Check Node version
node -v
# Check NPM version
npm -v
```


2. **Truffle v5.X.X** - A development framework for Ethereum. 
```bash
# Unsinstall any previous version
npm uninstall -g truffle
# Install
npm install -g truffle
# Specify a particular version
npm install -g truffle@5.0.2
# Verify the version
truffle version
```


2. **Metamask: 5.3.1** - If you need to update Metamask just delete your Metamask extension and install it again.


3. [Ganache](https://www.trufflesuite.com/ganache) - Make sure that your Ganache and Truffle configuration file have the same port.


4. **Other mandatory packages**:
```bash
cd app
# install packages
npm install --save  openzeppelin-solidity@2.3
npm install --save  truffle-hdwallet-provider@1.0.17
npm install webpack-dev-server -g
npm install web3
```


### Run the application
1. Clean the frontend 
```bash
cd app
# Remove the node_modules  
# remove packages
rm -rf node_modules
# clean cache
npm cache clean
rm package-lock.json
# initialize npm (you can accept defaults)
npm init
# install all modules listed as dependencies in package.json
npm install
```


2. Start Truffle by running
```bash
# For starting the development console
truffle develop
# truffle console

# For compiling the contract, inside the development console, run:
compile

# For migrating the contract to the locally running Ethereum network, inside the development console
migrate --reset

# For running unit tests the contract, inside the development console, run:
test
```

3. Frontend - Once you are ready to start your frontend, run the following from the app folder:
```bash
cd app
npm run dev
```

---

### Important
When you will add a new Rinkeyby Test Network in your Metamask client, you will have to provide:

| Network Name | New RPC URL | Chain ID |
|---|---|---|
|Private Network 1|`http://127.0.0.1:9545/`|1337 |

The chain ID above can be fetched by:
```bash
cd app
node index.js
```

## Troubleshoot
#### Error 1 
```
'webpack-dev-server' is not recognized as an internal or external command
```
**Solution:**
- Delete the node_modules folder, the one within the /app folder
- Execute `npm install` command from the /app folder

After a long install, everything will work just fine!


#### Error 2
```
ParserError: Source file requires different compiler version. 
Error: Truffle is currently using solc 0.5.16, but one or more of your contracts specify "pragma solidity >=0.X.X <0.X.X".
```
**Solution:** In such a case, ensure the following in `truffle-config.js`:
```js
// Configure your compilers  
compilers: {    
  solc: {      
    version: "0.5.16", // <- Use this        
    // docker: true,
    // ...
```

## Raise a PR or report an Issue
1. Feel free to raise a [Pull Request](https://github.com/udacity/nd1309-p2-Decentralized-Star-Notary-Service-Starter-Code/pulls) if you find a bug/scope of improvement in the current repository. 

2. If you have suggestions or facing issues, you can log in issue. 

---

Do not use the [Old depreacted zipped starter code](https://s3.amazonaws.com/video.udacity-data.com/topher/2019/January/5c51c4c0_project-5-starter-code/project-5-starter-code.zip)

# Implementation notes

Opened a [question](https://knowledge.udacity.com/questions/709048) for a technical mentor. With the mandated truffle version 5.0.2 the deployment of Migrations failed. I upgraded truffle to 5.4.13 and the deployment of oth Migrations and StarNotary worked just fine. This project is implemented with truffle 5.4.13

## Task 1: Add name and symbol preperties
Added a constructor to the contract that takes name and symbol as parameters. Decided that once a contract is deployed, name and symbol should be immutable, so added private veriables with a read function.

## Task 2: Tests for the token name and symbol
Implemented and ran tests

```text
truffle(develop)> test
Using network 'develop'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



  ✓ can Create a Star (120ms)
  ✓ lets user1 put up their star for sale (152ms)
  ✓ lets user1 get the funds after the sale (207ms)
  ✓ lets user2 buy a star, if it is put up for sale (229ms)
  ✓ lets user2 buy a star and decreases its balance in ether (182ms)
  ✓ can add the star name and star symbol properly (109ms)
  ✓ lets 2 users exchange stars
  ✓ lets a user transfer a star
  ✓ lookUptokenIdToStarInfo test
```

based upon these results I added .skip to the tests that should not run. I'm going to be a little judgy here, but two things:
1. you should write your tests before implementing the code. A more common practice is to write the tests afterwards, but this is bad.
2. you should not write tests that pass without the code even implemented. That is disastrous. The last three tests should FAIL because the code is not implemented. Bad practice. Part of this is course is to teach students development practices as well as the technology. This is a very bad example to set.

```text
truffle(develop)> test
Using network 'develop'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



  ✓ can Create a Star (97ms)
  ✓ lets user1 put up their star for sale (122ms)
  ✓ lets user1 get the funds after the sale (163ms)
  ✓ lets user2 buy a star, if it is put up for sale (174ms)
  ✓ lets user2 buy a star and decreases its balance in ether (167ms)
  ✓ can add the star name and star symbol properly (90ms)
  - lets 2 users exchange stars
  - lets a user transfer a star
  - lookUptokenIdToStarInfo test

  6 passing (816ms)
  3 pending
```

## 
