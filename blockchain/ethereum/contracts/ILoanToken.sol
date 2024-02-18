// ILoanToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ILoanToken {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}
