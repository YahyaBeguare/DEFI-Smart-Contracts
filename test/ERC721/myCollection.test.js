const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyCollection", function () {
    let MyCollection;
    let myCollection;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        // Get the ContractFactory and Signers
        MyCollection = await ethers.getContractFactory("MyCollection");
        [owner,nonOwner, addr1, addr2] = await ethers.getSigners();

        // Deploy the contract
        myCollection = await MyCollection.deploy(
            "MyCollection", // Name
            "MC", // Symbol
            owner.address, // Initial owner
            "ipfs://collection-metadata", // Initial collection metadata URI
            ethers.parseEther("0.1") // Minting cost (0.1 Ether)
        );

        await myCollection.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the correct name and symbol", async function () {
            expect(await myCollection.name()).to.equal("MyCollection");
            expect(await myCollection.symbol()).to.equal("MC");
        });

        it("Should set the correct owner", async function () {
            expect(await myCollection.owner()).to.equal(owner.address);
        });

        it("Should set the correct initial collection metadata URI", async function () {
            expect(await myCollection.collectionMetadataURI()).to.equal("ipfs://collection-metadata");
        });

        it("Should set the correct minting cost", async function () {
            expect(await myCollection.cost()).to.equal(ethers.parseEther("0.1"));
        });
    });

    describe("Minting", function () {
        it("Should mint a new NFT and assign the correct token URI", async function () {
            const tokenURI = "ipfs://token-uri";

            // Mint an NFT
            await myCollection.mint(addr1.address, tokenURI, {
                value: ethers.parseEther("0.1"), // Send 0.1 Ether
            });

            // Check token URI
            expect(await myCollection.tokenURI(0)).to.equal(tokenURI);

            // Check owner of the token
            expect(await myCollection.ownerOf(0)).to.equal(addr1.address);

            // Check token counter
            expect(await myCollection.tokenCounter()).to.equal(1);
        });

        it("Should fail if insufficient funds are sent", async function () {
            const tokenURI = "ipfs://token-uri";

            // Attempt to mint with insufficient funds
            await expect(
                myCollection.mint(addr1.address, tokenURI, {
                    value: ethers.parseEther("0.05"), // Send 0.05 Ether (less than required)
                })
            ).to.be.revertedWith("Insufficient funds");
        });

        it("Should fail if minting is paused", async function () {
            const tokenURI = "ipfs://token-uri";

            // Pause the contract
            await myCollection.pause();

            // Attempt to mint while paused
            await expect(
                myCollection.mint(addr1.address, tokenURI, {
                    value: ethers.parseEther("0.1"),
                })
            ).to.be.revertedWithCustomError(myCollection, "EnforcedPause"); // Check for the custom error
        });
    });

    describe("Collection Metadata", function () {
        it("Should allow the owner to update the collection metadata URI", async function () {
            const newMetadataURI = "ipfs://new-collection-metadata";

            // Update collection metadata URI
            await myCollection.setCollectionMetadataURI(newMetadataURI);

            // Check the updated URI
            expect(await myCollection.collectionMetadataURI()).to.equal(newMetadataURI);
        });

        it("Should fail if a non-owner tries to update the collection metadata URI", async function () {
            const newMetadataURI = "ipfs://new-collection-metadata";

            // Attempt to update collection metadata URI as a non-owner
            await expect(
                myCollection.connect(nonOwner).setCollectionMetadataURI(newMetadataURI)
            ).to.be.revertedWithCustomError(myCollection, "OwnableUnauthorizedAccount")
            .withArgs(nonOwner.address); // Check for the custom error
        });
    });

    describe("Pausing", function () {
        it("Should allow the owner to pause and unpause the contract", async function () {
            // Pause the contract
            await myCollection.pause();
            expect(await myCollection.paused()).to.be.true;

            // Unpause the contract
            await myCollection.unpause();
            expect(await myCollection.paused()).to.be.false;
        });

        it("Should fail if a non-owner tries to pause or unpause the contract", async function () {
            // Attempt to pause as a non-owner
            await expect(myCollection.connect(addr1).pause()).to.be.revertedWithCustomError(myCollection, "OwnableUnauthorizedAccount")
            .withArgs(addr1.address); // Check for the custom error

            // Attempt to unpause as a non-owner
            await expect(myCollection.connect(addr1).unpause()).to.be.revertedWithCustomError(myCollection, "OwnableUnauthorizedAccount")
            .withArgs(addr1.address); // Check for the custom error
        });
    });

    describe("Token URIs", function () {
        it("Should retrieve all token URIs", async function () {
            const tokenURI1 = "ipfs://token-uri-1";
            const tokenURI2 = "ipfs://token-uri-2";

            // Mint two NFTs
            await myCollection.mint(addr1.address, tokenURI1, {
                value: ethers.parseEther("0.1"),
            });
            await myCollection.mint(addr2.address, tokenURI2, {
                value: ethers.parseEther("0.1"),
            });

            // Retrieve all token URIs
            const tokenURIs = await myCollection.getAllTokenURIs();

            // Check the token URIs
            expect(tokenURIs).to.have.lengthOf(2);
            expect(tokenURIs[0]).to.equal(tokenURI1);
            expect(tokenURIs[1]).to.equal(tokenURI2);
        });
    });
});