const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

var StarIdGeneratorFn = function*() {
    var i = 0
    while(true)
        yield ++i
}
var StarIdGenerator = StarIdGeneratorFn();

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async () => {
    let tokenId = StarIdGenerator.next().value;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, { from: accounts[0] })
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = StarIdGenerator.next().value;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = StarIdGenerator.next().value;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, { from: user2, value: balance });
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = StarIdGenerator.next().value;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, { from: user2, value: balance });
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = StarIdGenerator.next().value;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, { from: user2, value: balance, gasPrice: 0 });
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async () => {
    // 1. create a Star with different tokenId
    let instance = await StarNotary.deployed()
    let star = {
        id: StarIdGenerator.next().value,
        name: 'Pollux',
        user: accounts[1]
    }
    await instance.createStar(star.name, star.id, { from: star.user })
    //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    let actualName = await instance.name.call()
    let actualSymbol = await instance.symbol.call()
    let expectedName = "The Universe Of Stars"
    let expectedSymbol = "STAR"
    assert.equal(actualName + actualSymbol, expectedName + expectedSymbol)
});

it('lets 2 users exchange stars', async () => {
    let instance = await StarNotary.deployed()
    // 1. create 2 Stars with different tokenId
    let star1 = {
        id: StarIdGenerator.next().value,
        name: 'Castor',
        user: accounts[2]
    }
    let star2 = {
        id: StarIdGenerator.next().value,
        name: 'Alhena',
        user: accounts[3]
    }
    let star3 = {
        id: StarIdGenerator.next().value,
        name: 'Propus',
        user: accounts[4]
    }
    let star4 = {
        id: StarIdGenerator.next().value,
        name: 'Wasat',
        user: accounts[5]
    }
    let star5 = {
        id: StarIdGenerator.next().value,
        name: 'Wasat',
        user: accounts[5]
    }
    await instance.createStar(star1.name, star1.id, {from: star1.user})
    await instance.createStar(star2.name, star2.id, {from: star2.user})
    await instance.createStar(star3.name, star3.id, {from: star3.user})
    await instance.createStar(star4.name, star4.id, {from: star4.user})
    await instance.createStar(star5.name, star5.id, {from: star5.user})
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    try {
        await instance.exchangeStars(star1.id, star2.id, { from: star4.user })
        assert.fail('expected an error from the contract')
    } catch (err) {
        assert.isTrue(err.message.includes("star not owned"))
    }

    try {
        await instance.exchangeStars(star4.id, star5.id, { from: star5.user })
        assert.fail('expected an error from the contract')
    } catch (err) {
        assert.isTrue(err.message.includes("same token or owner"))
    }

    try {
        await instance.exchangeStars(star3.id, star4.id, { from: star3.user })
    } catch (err) {
        assert.fail(`Unexpected error: ${err.message}`)
    }
    // 3. Verify that the owners changed
    assert.equal(await instance.ownerOf(star3.id), star4.user)
    assert.equal(await instance.ownerOf(star4.id), star3.user)
});

it('lets a user transfer a star', async () => {
    let instance = await StarNotary.deployed()
    let star1 = {
        id: StarIdGenerator.next().value,
        name: 'Tejat',
        user: owner
    }
    let star2 = {
        id: StarIdGenerator.next().value,
        name: 'Mebsuta',
        user: accounts[5]
    }
    let user3 = accounts[3]
    // 1. create a Star with different tokenId
    await instance.createStar(star1.name, star1.id, { from: star1.user })
    await instance.createStar(star2.name, star2.id, { from: star2.user })
    
    // 2. use the transferStar function implemented in the Smart Contract
    try {
        await instance.transferStar(user3, star2.id, {from: star1.user})
        assert.fail('expected an error from the contract')
    } catch(err) {
        assert.isTrue(err.message.includes("star not owned"))
    }
    try {
        await instance.transferStar(user3, star1.id, {from: star1.user})
    } catch(err) {
        assert.fail(`Unexpected error: ${err.message}`)
    }

    // 3. Verify the star owner changed.
    assert.equal(await instance.ownerOf(star1.id), user3)
});

it('lookUptokenIdToStarInfo test', async () => {
    // 1. create a Star with different tokenId
    let instance = await StarNotary.deployed()
    let star1 = {
        id: StarIdGenerator.next().value,
        name: 'Mekbuda',
        user: owner
    }
    let star2 = {
        id: StarIdGenerator.next().value,
        name: 'Alzirr',
        user: owner
    }
    await instance.createStar(star1.name, star1.id, { from: star1.user })
    await instance.createStar(star2.name, star2.id, { from: star2.user })
    // 2. Call your method lookUptokenIdToStarInfo
    let actualStar1Name = await instance.lookUptokenIdToStarInfo(star1.id)
    let actualStar2Name = await instance.lookUptokenIdToStarInfo(star2.id)
    // 3. Verify if you Star name is the same
    assert.equal(star1.name + star2.name, actualStar1Name + actualStar2Name)
});