const { expect } = require("chai");
const { ethers } = require("hardhat");
const { keccak256, toUtf8Bytes } = require("ethers");  // ✅ Import separately

describe("ReviewStorage", function () {
    let ReviewStorage, reviewStorage, owner, addr1;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        ReviewStorage = await ethers.getContractFactory("ReviewStorage");
        reviewStorage = await ReviewStorage.deploy();
        await reviewStorage.waitForDeployment();
    });

    it("Should store a hash and retrieve it", async function () {
        const testHash = keccak256(toUtf8Bytes("Test Review"));  // ✅ Updated usage

        await reviewStorage.storeHash(testHash);
        expect(await reviewStorage.getHash()).to.equal(testHash);
    });

    it("Should only allow the owner to store a hash", async function () {
        const testHash = keccak256(toUtf8Bytes("Another Review"));  // ✅ Updated usage

        await reviewStorage.storeHash(testHash);
        expect(await reviewStorage.getHash()).to.equal(testHash);

        await expect(reviewStorage.connect(addr1).storeHash(testHash)).to.be.revertedWith("Not authorized");
    });
});
