import Web3 from "web3";
import starNotaryArtifact from "../../build/contracts/StarNotary.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function () {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = starNotaryArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        starNotaryArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  setStatus: function (message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  createStar: async function () {
    const { createStar } = this.meta.methods;
    const name = document.getElementById("starName").value;
    const id = document.getElementById("starId").value;
    await createStar(name, id).send({ from: this.account });
    App.setStatus("New Star Owner is " + this.account + ".");
  },

  // Implement Task 4 Modify the front end of the DAPP
  lookUp: async function () {
    const tokenIdRaw = document.getElementById("lookid").value
    if (isNaN(tokenIdRaw.toString(10))) {
      App.setStatus("Star ID in lookup must be a number")
      return
    }
    const tokenId = tokenIdRaw.toString(10)
    try {
      const owner = await this.meta.methods.ownerOf(tokenId).call({ from: this.account })
      const starName = await this.meta.methods.lookUptokenIdToStarInfo(tokenId).call({ from: this.account })
      App.setStatus(`<table id="star-info"><thead><tr><th colspan="2">Star Info for Star ID: ${tokenId}</th></tr><tr><th>Name</th><th>Owner</th></tr></thead><tbody><tr><td>${starName}</td><td>${owner}</td></tr></tbody></table>`)
    } catch (err) {
      App.setStatus(`Star ID: ${tokenId} generates an error: ${err.message}`)
    }
  }
};

window.App = App;

window.addEventListener("load", async function () {
  var provider = await detectEthereumProvider()

  if (provider) {
    provider.on("accountsChanged", (accounts) => {
      if (accounts.length > 0)
        App.account = accounts[0]
    })
    App.web3 = new Web3(provider);
    try {
      let accs = await ethereum.request({ method: 'eth_requestAccounts' });
      App.account = accs[0]
      //await window.ethereum.enable(); // get permission to access accounts
    } catch {
      console.error('Something funny with your wallet. Install metamask?')
    }
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
  }

  App.start();
});