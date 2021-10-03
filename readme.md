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

## Task 1: lookUptokenIdToStarInfo

Implemented the function by returning the name property of the Star structure stored in `tokenIdToStarInfo` at the index designated by the `_tokenId` parameter.

## Task 2: lookUptokenIdToStarInfo test

Wrote a test that creates 2 stars and then requests the names.

```text
truffle(develop)> test
Using network 'develop'.


Compiling your contracts...
===========================
> Compiling ./contracts/StarNotary.sol
> Artifacts written to /tmp/test--1050426-b1i41CfQbn3S
> Compiled successfully using:
   - solc: 0.5.16+commit.9c3226ce.Emscripten.clang



  ✓ can Create a Star (77ms)
  ✓ lets user1 put up their star for sale (106ms)
  ✓ lets user1 get the funds after the sale (163ms)
  ✓ lets user2 buy a star, if it is put up for sale (175ms)
  ✓ lets user2 buy a star and decreases its balance in ether (159ms)
  ✓ can add the star name and star symbol properly (81ms)
  - lets 2 users exchange stars
  - lets a user transfer a star
  ✓ lookUptokenIdToStarInfo test (129ms)

  7 passing (897ms)
  2 pending
```

## Task 1: Exchange Stars function

Implemented a function that checks for ownership of one of the stars and makes sure the owners are different.

## Task 2: Test for Exchange Stars function

Wrote a test that goes through the implemented functionality

```text
truffle(develop)> test
Using network 'develop'.


Compiling your contracts...
===========================
> Compiling ./contracts/StarNotary.sol
> Artifacts written to /tmp/test--1054357-UNq2ZCRYTcpH
> Compiled successfully using:
   - solc: 0.5.16+commit.9c3226ce.Emscripten.clang



  ✓ can Create a Star (110ms)
  ✓ lets user1 put up their star for sale (127ms)
  ✓ lets user1 get the funds after the sale (166ms)
  ✓ lets user2 buy a star, if it is put up for sale (184ms)
  ✓ lets user2 buy a star and decreases its balance in ether (165ms)
  ✓ can add the star name and star symbol properly (114ms)
  ✓ lets 2 users exchange stars (656ms)
  - lets a user transfer a star
  ✓ lookUptokenIdToStarInfo test (133ms)

  8 passing (2s)
  1 pending
```

This exercise would not be complete without questioning the design of this contract function. An exchange of properties should not be triggered by the actions of just one party. I could not put aside the feeling of doom, implementing this function. Hence this scribble about it.

## Task 1: Transfer Star function

Implemented a function that checks for ownership of the star and transfers it to the requested address

## Task 2: Transfer Star test

Implemented test for the provided functionality

```text
truffle(develop)> test
Using network 'develop'.


Compiling your contracts...
===========================
> Compiling ./contracts/StarNotary.sol
> Artifacts written to /tmp/test--1059636-Fd1Hzsmqk44K
> Compiled successfully using:
   - solc: 0.5.16+commit.9c3226ce.Emscripten.clang



  ✓ can Create a Star (73ms)
  ✓ lets user1 put up their star for sale (103ms)
  ✓ lets user1 get the funds after the sale (147ms)
  ✓ lets user2 buy a star, if it is put up for sale (170ms)
  ✓ lets user2 buy a star and decreases its balance in ether (150ms)
  ✓ can add the star name and star symbol properly (106ms)
  ✓ lets 2 users exchange stars (652ms)
  ✓ lets a user transfer a star (200ms)
  ✓ lookUptokenIdToStarInfo test (122ms)

  9 passing (2s)
```

This exercise would also not be complete without pointing out the waste of gas that is inflicted. The parent contract already contains a transferFrom function, since that is required in the ERC721 interface. The implementation of this function already does the ownership check.
