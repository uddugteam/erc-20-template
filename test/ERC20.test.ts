import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const AMOUNT = ethers.parseEther("100");
const NAME = "Token";
const SYMBOL = "TKN";

describe("TestToken unit tests", function () {
  async function deployContractsFixture() {
    const [owner, spender, user, from, to, user1, user2, user3] = await ethers.getSigners();
    const users = [user1, user2, user3];

    const token = await ethers.deployContract("Token", [NAME, SYMBOL]);
    await token.waitForDeployment();

    return { token, user, from, to, owner, spender, users };
  }
  describe("Deploy", function () {
    it("Should deploy with proper address", async function () {
      const { token } = await loadFixture(deployContractsFixture);

      expect(token.target).to.be.properAddress;
    });

    it("Should deploy with right name", async function () {
      const { token } = await loadFixture(deployContractsFixture);

      expect(await token.name()).to.be.equal(NAME);
    });

    it("Should deploy with right symbol", async function () {
      const { token } = await loadFixture(deployContractsFixture);

      expect(await token.symbol()).to.be.equal(SYMBOL);
    });

    it("Should deploy with 0 initial total supply", async function () {
      const { token } = await loadFixture(deployContractsFixture);

      expect(await token.totalSupply()).to.be.equal(0);
    });
  });

  describe("Mint", function () {
    it("Should increase balance of caller on given amount", async function () {
      const { token, owner, user } = await loadFixture(deployContractsFixture);

      const mintAmount = AMOUNT;

      await expect(token.connect(owner).mint(user, mintAmount)).to.changeTokenBalance(token, user, mintAmount);
    });

    it("Should increase total supply", async function () {
      const { token, owner, user } = await loadFixture(deployContractsFixture);

      const mintAmount = AMOUNT;
      const currTotalSupply = await token.totalSupply();

      await token.connect(owner).mint(user, mintAmount);
      expect(await token.totalSupply()).to.be.equal(currTotalSupply + mintAmount);
    });

    it("Should emit transfer event with right args", async function () {
      const { token, owner, user } = await loadFixture(deployContractsFixture);

      const mintAmount = AMOUNT;

      await expect(token.connect(owner).mint(user, mintAmount))
        .to.emit(token, "Transfer")
        .withArgs(ethers.ZeroAddress, user.address, mintAmount);
    });

    it("Should work for several mints for different addresses", async function () {
      const { token, owner, users } = await loadFixture(deployContractsFixture);

      const mintAmount = AMOUNT;
      const currTotalSupply = await token.totalSupply();

      for (const user of users) {
        await token.connect(owner).mint(user, mintAmount);
        expect(await token.balanceOf(user)).to.be.equal(mintAmount);
      }

      expect(await token.totalSupply()).to.be.equal(currTotalSupply + AMOUNT * 3n);
    });

    it("Should revert if caller is not owner", async function () {
      const { token, from, user } = await loadFixture(deployContractsFixture);

      const mintAmount = AMOUNT;

      await expect(token.connect(from).mint(user, mintAmount))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
        .withArgs(from.address);
    });
  });

  describe("Transfer", function () {
    it("Should increase balance of `to` address", async function () {
      const { token, owner, from, to } = await loadFixture(deployContractsFixture);

      const transferAmount = AMOUNT;
      const mintAmount = AMOUNT;
      await token.connect(owner).mint(from, mintAmount);
      const tx = token.connect(from).transfer(to.address, transferAmount);

      await expect(tx).to.changeTokenBalances(token, [to, from], [transferAmount, -transferAmount]);
    });

    it("Should not change total supply", async function () {
      const { token, owner, from, to } = await loadFixture(deployContractsFixture);

      const transferAmount = AMOUNT;
      const mintAmount = AMOUNT;
      await token.connect(owner).mint(from, mintAmount);
      const currTotalSupply = await token.totalSupply();
      await token.connect(from).transfer(to.address, transferAmount);

      expect(await token.totalSupply()).to.be.equal(currTotalSupply);
    });

    it("Should emit transfer event with right args", async function () {
      const { token, owner, from, to } = await loadFixture(deployContractsFixture);

      const transferAmount = AMOUNT;
      const mintAmount = AMOUNT;
      await token.connect(owner).mint(from, mintAmount);

      await expect(token.connect(from).transfer(to.address, transferAmount))
        .to.emit(token, "Transfer")
        .withArgs(from.address, to.address, transferAmount);
    });

    it("Should revert if `to` is a zero address", async function () {
      const { token, owner, from } = await loadFixture(deployContractsFixture);

      const transferAmount = AMOUNT;
      const mintAmount = AMOUNT;
      await token.connect(owner).mint(from, mintAmount);
      const tx = token.connect(from).transfer(ethers.ZeroAddress, transferAmount);

      await expect(tx).to.be.revertedWithCustomError(token, "ERC20InvalidReceiver").withArgs(ethers.ZeroAddress);
    });

    it("Should revert if caller balance is less than amount to transfer", async function () {
      const { token, owner, from, to } = await loadFixture(deployContractsFixture);

      const transferAmount = AMOUNT;
      const mintAmount = AMOUNT - 1n;
      await token.connect(owner).mint(from, mintAmount);
      const tx = token.connect(from).transfer(to.address, transferAmount);

      await expect(tx)
        .to.be.revertedWithCustomError(token, "ERC20InsufficientBalance")
        .withArgs(from.address, await token.balanceOf(from.address), transferAmount);
    });

    it("Should work for several transfers for different addresses", async function () {
      const { token, owner, users } = await loadFixture(deployContractsFixture);

      const transferAmount = AMOUNT;
      const mintAmount = AMOUNT * 3n;

      for (const user of users) {
        await token.connect(owner).mint(user, mintAmount);

        await expect(token.connect(user).transfer(owner, transferAmount)).to.changeTokenBalances(
          token,
          [user, owner],
          [-transferAmount, transferAmount],
        );
      }
    });
  });

  describe("Approve", function () {
    it("Should update `_allowances` mapping by setting on `amount`", async function () {
      const { token, user, spender } = await loadFixture(deployContractsFixture);

      const approveAmount = AMOUNT;
      await token.connect(user).approve(spender, approveAmount);

      expect(await token.allowance(user, spender)).to.be.equal(approveAmount);
    });

    it("Should emit approval event with right args", async function () {
      const { token, user, spender } = await loadFixture(deployContractsFixture);

      const approveAmount = AMOUNT;

      await expect(token.connect(user).approve(spender.address, approveAmount))
        .to.emit(token, "Approval")
        .withArgs(user.address, spender.address, approveAmount);
    });

    it("Should revert if approval given for zero address", async function () {
      const { token, owner } = await loadFixture(deployContractsFixture);

      const approveAmount = AMOUNT;
      const tx = token.connect(owner).approve(ethers.ZeroAddress, approveAmount);

      await expect(tx).to.be.revertedWithCustomError(token, "ERC20InvalidSpender").withArgs(ethers.ZeroAddress);
    });

    it("Should work for several approvals for different addresses", async function () {
      const { token, owner, users } = await loadFixture(deployContractsFixture);

      const approveAmount = AMOUNT;

      for (const user of users) {
        await token.connect(user).approve(owner, approveAmount);
        expect(await token.allowance(user, owner)).to.be.equal(approveAmount);
      }
    });
  });

  describe("Transfer from", function () {
    it("Should update `_allowances` mapping by decreasing on `amount`", async function () {
      const { token, owner, from, to } = await loadFixture(deployContractsFixture);

      const transferAmount = AMOUNT - 500n;
      const mintAmount = AMOUNT;
      const approveAmount = AMOUNT;
      await token.connect(owner).mint(from, mintAmount);
      await token.connect(from).approve(owner, approveAmount);
      const currAllowance = await token.allowance(from, owner);
      await token.connect(owner).transferFrom(from, to, transferAmount);

      expect(await token.allowance(from, owner)).to.be.equal(currAllowance - transferAmount);
    });

    it("Should increase balance of `to` address", async function () {
      const { token, owner, from, to } = await loadFixture(deployContractsFixture);

      const transferAmount = AMOUNT - 500n;
      const mintAmount = AMOUNT;
      const approveAmount = AMOUNT;
      await token.connect(owner).mint(from, mintAmount);
      await token.connect(from).approve(owner, approveAmount);
      const tx = token.connect(owner).transferFrom(from, to, transferAmount);

      await expect(tx).to.changeTokenBalances(token, [to, from], [transferAmount, -transferAmount]);
    });

    it("Should not change total supply", async function () {
      const { token, owner, from, to } = await loadFixture(deployContractsFixture);

      const transferAmount = AMOUNT - 500n;
      const mintAmount = AMOUNT;
      const approveAmount = AMOUNT;
      await token.connect(owner).mint(from, mintAmount);
      const currTotalSupply = await token.totalSupply();
      await token.connect(from).approve(owner, approveAmount);

      await token.connect(owner).transferFrom(from, to, transferAmount);

      expect(await token.totalSupply()).to.be.equal(currTotalSupply);
    });

    it("Should emit transfer event with right args", async function () {
      const { token, owner, from, to } = await loadFixture(deployContractsFixture);

      const transferAmount = AMOUNT;
      const mintAmount = AMOUNT;
      const approveAmount = AMOUNT;
      await token.connect(owner).mint(from, mintAmount);
      await token.connect(from).approve(owner, approveAmount);

      await expect(token.connect(owner).transferFrom(from, to, transferAmount))
        .to.emit(token, "Transfer")
        .withArgs(from.address, to.address, transferAmount);
    });

    it("Should revert if `to` is a zero address", async function () {
      const { token, owner, from } = await loadFixture(deployContractsFixture);

      const transferAmount = AMOUNT;
      const mintAmount = AMOUNT;
      const approveAmount = AMOUNT;
      await token.connect(owner).mint(from, mintAmount);
      await token.connect(from).approve(owner, approveAmount);
      const tx = token.connect(owner).transferFrom(from.address, ethers.ZeroAddress, transferAmount);

      await expect(tx).to.be.revertedWithCustomError(token, "ERC20InvalidReceiver").withArgs(ethers.ZeroAddress);
    });

    it("Should revert if `from` is a zero address", async function () {
      const { token, owner, to } = await loadFixture(deployContractsFixture);

      const transferAmount = AMOUNT;
      const tx = token.connect(owner).transferFrom(ethers.ZeroAddress, to.address, transferAmount);

      await expect(tx).to.be.reverted;
    });
    it("Should revert if allowance is not enough", async function () {
      const { token, owner, from, to } = await loadFixture(deployContractsFixture);

      const transferAmount = AMOUNT;
      const mintAmount = AMOUNT;
      const approveAmount = AMOUNT - 200n;
      await token.connect(owner).mint(from, mintAmount);
      await token.connect(from).approve(owner, approveAmount);
      const tx = token.connect(owner).transferFrom(from, to, transferAmount);

      await expect(tx)
        .to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance")
        .withArgs(owner.address, await token.allowance(from, owner), transferAmount);
    });

    it("Should revert if allowance is 0 and transfer amount is non-zero", async function () {
      const { token, owner, from, to } = await loadFixture(deployContractsFixture);

      const transferAmount = AMOUNT;
      const mintAmount = AMOUNT;
      await token.connect(owner).mint(from, mintAmount);
      const tx = token.connect(owner).transferFrom(from.address, to.address, transferAmount);

      await expect(tx)
        .to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance")
        .withArgs(owner.address, await token.allowance(from, owner), transferAmount);
    });

    it("Should revert if not enough balance on `from` address", async function () {
      const { token, owner, from, to } = await loadFixture(deployContractsFixture);

      const transferAmount = AMOUNT;
      const mintAmount = AMOUNT - 200n;
      const approveAmount = AMOUNT;
      await token.connect(owner).mint(from, mintAmount);
      await token.connect(from).approve(owner, approveAmount);
      const tx = token.connect(owner).transferFrom(from, to, transferAmount);

      await expect(tx)
        .to.be.revertedWithCustomError(token, "ERC20InsufficientBalance")
        .withArgs(from.address, await token.balanceOf(from.address), transferAmount);
    });
  });
});
