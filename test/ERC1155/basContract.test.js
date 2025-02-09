const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BasContract", function () {
  let basContract;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const BasContract = await ethers.getContractFactory("BasContract");
    // Deploy the contract with a base URI (which ERC1155 uses internally)
    basContract = await BasContract.deploy("https://example.com/metadata/{id}.json");
    await basContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await basContract.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint a single token (NFT style)", async function () {
      // Mint token with id 1 and amount 1 (unique NFT)
      await basContract.mint(addr1.address, 1, 1, "0x");
      expect(await basContract.balanceOf(addr1.address, 1)).to.equal(1);
    });

    it("Should allow owner to mint fungible tokens", async function () {
      // Mint token with id 2 and amount 1000 (fungible)
      await basContract.mint(addr1.address, 2, 1000, "0x");
      expect(await basContract.balanceOf(addr1.address, 2)).to.equal(1000);
    });

    it("Should allow owner to mint a batch of tokens", async function () {
      const ids = [3, 4, 5];
      const amounts = [50, 75, 100];
      await basContract.mintBatch(addr1.address, ids, amounts, "0x");
      for (let i = 0; i < ids.length; i++) {
        expect(await basContract.balanceOf(addr1.address, ids[i])).to.equal(amounts[i]);
      }
    });

    it("Should revert when a non-owner attempts to mint", async function () {
      await expect(
        basContract.connect(addr1).mint(addr1.address, 6, 10, "0x")
      ).to.be.revertedWithCustomError(basContract, "OwnableUnauthorizedAccount")
      .withArgs(addr1.address);
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      // Mint tokens to addr1 for burn tests
      await basContract.mint(addr1.address, 7, 200, "0x");
      await basContract.mintBatch(addr1.address, [8, 9], [300, 400], "0x");
    });

    it("Should allow token holders to burn a single token", async function () {
      // addr1 burns 50 tokens of id 7
      await basContract.connect(addr1).burn(addr1.address, 7, 50);
      expect(await basContract.balanceOf(addr1.address, 7)).to.equal(150);
    });

    it("Should allow token holders to burn tokens in batch", async function () {
      // addr1 burns part of tokens with ids 8 and 9
      await basContract.connect(addr1).burnBatch(addr1.address, [8, 9], [150, 200]);
      expect(await basContract.balanceOf(addr1.address, 8)).to.equal(150);
      expect(await basContract.balanceOf(addr1.address, 9)).to.equal(200);
    });
  });

  describe("Transfers and Approvals", function () {
    beforeEach(async function () {
      // Mint tokens to addr1 for transfer tests
      await basContract.mint(addr1.address, 10, 1000, "0x");
    });

    it("Should allow safeTransferFrom when approved", async function () {
      // addr1 approves addr2 to transfer tokens on its behalf
      await basContract.connect(addr1).setApprovalForAll(addr2.address, true);
      // addr2 transfers 300 tokens of id 10 from addr1 to itself
      await basContract
        .connect(addr2)
        .safeTransferFrom(addr1.address, addr2.address, 10, 300, "0x");
      expect(await basContract.balanceOf(addr1.address, 10)).to.equal(700);
      expect(await basContract.balanceOf(addr2.address, 10)).to.equal(300);
    });

    it("Should allow safeBatchTransferFrom when approved", async function () {
      // Mint additional tokens with different ids to addr1 for batch transfer
      await basContract.mintBatch(addr1.address, [11, 12], [200, 300], "0x");
      // addr1 approves addr2
      await basContract.connect(addr1).setApprovalForAll(addr2.address, true);
      // addr2 performs a batch transfer from addr1 to itself
      await basContract
        .connect(addr2)
        .safeBatchTransferFrom(addr1.address, addr2.address, [11, 12], [50, 100], "0x");
      expect(await basContract.balanceOf(addr1.address, 11)).to.equal(150);
      expect(await basContract.balanceOf(addr1.address, 12)).to.equal(200);
      expect(await basContract.balanceOf(addr2.address, 11)).to.equal(50);
      expect(await basContract.balanceOf(addr2.address, 12)).to.equal(100);
    });
  });
});
