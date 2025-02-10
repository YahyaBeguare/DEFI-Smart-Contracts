const {ethers} = require("hardhat");
const { expect } = require("chai");


describe("AdvContract", function(){
    let AdvContract, advContract, addr1, addr2, owner;
    const baseURI = "https://example.com/metadata/";

    beforeEach( async function(){
        
        [addr1, addr2, owner] = await ethers.getSigners();
        AdvContract = await ethers.getContractFactory("AdvContract");
        advContract = await AdvContract.deploy(owner.address, baseURI);
        await advContract.waitForDeployment();

    });

    describe("Deployement", function(){
        it("Should set the right owner and the right base URI", async function(){
            expect(await advContract.owner()).to.equal(owner.address);
            expect(await advContract.uri(0)).to.equal(baseURI);
         });

            });

    describe("Setting new URI",function(){
        it("Should revert if not called by owner", async function () {
            await expect(advContract.connect(addr1).setURI("https://newuri.com/metadata/")).to.be.revertedWithCustomError(advContract,"OwnableUnauthorizedAccount")
            .withArgs(addr1.address);
            });
        it("Should allow owner to set a new URI", async function () {
            const newURI = "https://newuri.com/metadata/";
            await advContract.connect(owner).setURI(newURI);
            expect(await advContract.uri(0)).to.equal(newURI);
          });
    })

    describe("Minting", function(){
        it("Should revert if minting not called by owner", async function () {
            await expect(advContract.connect(addr1).mint(addr1.address, 1, 100, "0x")).to.be.revertedWithCustomError(advContract,"OwnableUnauthorizedAccount")
            .withArgs(addr1.address);
            });
        it("Should allow owner to mint tokens", async function () {
            await advContract.connect(owner).mint(addr1.address, 1, 100, "0x");
            expect(await advContract.balanceOf(addr1.address, 1)).to.equal(100);
          });
        
          it("Should allow batch minting", async function () {
            await advContract.connect(owner).mintBatch(addr1.address, [1, 2], [50, 50], "0x");
            expect(await advContract.balanceOf(addr1.address, 1)).to.equal(50);
            expect(await advContract.balanceOf(addr1.address, 2)).to.equal(50);
          });
    })
        
    describe("Contract Pausing", function(){
        it("Should revert if not called by owner", async function () {
            await expect(advContract.connect(addr1).pause()).to.be.revertedWithCustomError(advContract,"OwnableUnauthorizedAccount")
            .withArgs(addr1.address);
            });
        it("Should allow owner to pause and unpause", async function () {
            await advContract.connect(owner).pause();
            expect(await advContract.paused()).to.be.true;
      
            await advContract.connect(owner).unpause();
            expect(await advContract.paused()).to.be.false;
          });
    })

    describe("Burning", function(){
        it("Should revert if burning is called by an unapproved third party", async function () {
            await advContract.connect(owner).mint(addr1.address, 1, 50, "0x");
        
            // Attempting to burn addr1's tokens from an unapproved address (owner)
            await expect(
                advContract.connect(owner).burn(addr1.address, 1, 50)
            ).to.be.revertedWithCustomError(advContract, "ERC1155MissingApprovalForAll")
            .withArgs(owner.address, addr1.address); 
        });
        
        it("Should allow token burning", async function () {
            await advContract.connect(owner).mint(addr1.address, 1, 100, "0x");
            await advContract.connect(addr1).burn(addr1.address, 1, 50);
            expect(await advContract.balanceOf(addr1.address, 1)).to.equal(50);
          });
        
          it("Should revert burning if balance is insufficient", async function () {
            await expect(advContract.connect(addr1).burn(addr1.address, 1, 50)).to.be.revertedWithCustomError(advContract, "ERC1155InsufficientBalance")
            .withArgs(addr1.address, 0, 50, 1);
          });
    })

    describe("Supply Tracking", function(){
        it("Should allow owner track total supply correctly", async function () {
            await advContract.connect(owner).mint(addr1.address, 1, 100, "0x");
            const totalSupply = await advContract["totalSupply(uint256)"](1);
            expect(totalSupply).to.equal(100);
          });
    })

})




  
 
 



  



  


