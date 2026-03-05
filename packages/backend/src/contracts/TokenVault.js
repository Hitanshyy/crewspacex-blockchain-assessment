'use strict';

const { getContract, setContract, getWallet, setWallet } = require('../store/chainStore');

/**
 * Simulated smart contract: TokenVault
 */

function deposit(contractAddress, fromAddress, amount) {
  const contract = getContract(contractAddress);
  const wallet = getWallet(fromAddress);

  if (!contract || !wallet) {
    return { success: false, error: 'Contract or wallet not found' };
  }

  const amountBigInt = BigInt(amount);

  if (wallet.balance < amountBigInt) {
    return { success: false, error: 'Insufficient balance' };
  }

  contract.balance += amountBigInt;
  wallet.balance -= amountBigInt;

  setContract(contractAddress, contract);
  setWallet(fromAddress, wallet);

  return { success: true, newContractBalance: contract.balance.toString() };
}

function withdraw(contractAddress, toAddress, amount, callerAddress) {
  const contract = getContract(contractAddress);

  if (!contract) {
    return { success: false, error: 'Contract not found' };
  }

  // Only contract owner can withdraw
  if (callerAddress.toLowerCase() !== contract.owner.toLowerCase()) {
  return {
    success: false,
    error: 'Unauthorized: only owner can withdraw'
  };
}

  const amountBigInt = BigInt(amount);

  if (contract.balance < amountBigInt) {
    return { success: false, error: 'Insufficient contract balance' };
  }

  let toWallet = getWallet(toAddress);

  if (!toWallet) {
    toWallet = { balance: 0n, nonce: 0 };
  }

  contract.balance -= amountBigInt;
  toWallet.balance += amountBigInt;

  setContract(contractAddress, contract);
  setWallet(toAddress, toWallet);

  return { success: true, newContractBalance: contract.balance.toString() };
}

function balanceOf(contractAddress) {
  const contract = getContract(contractAddress);

  if (!contract) {
    return { success: false, error: 'Contract not found' };
  }

  return { success: true, balance: contract.balance.toString() };
}

module.exports = {
  deposit,
  withdraw,
  balanceOf
};