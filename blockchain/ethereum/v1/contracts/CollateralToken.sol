// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract CollateralToken is
    ERC721URIStorage,
    Ownable,
    Pausable,
    ReentrancyGuard
{
    uint256 private _lastTokenId = 0;

    constructor(
        address ownerAddress
    ) ERC721("CollateralToken", "NCTTKN") Ownable(ownerAddress) {}

    function mintNFT(
        address _recipient,
        string memory tokenURI
    ) public onlyOwner nonReentrant returns (uint256) {
        uint256 tokenId = ++_lastTokenId;
        _safeMint(_recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        emit Mint(_recipient, tokenId, tokenURI);
        return tokenId;
    }

    /* ADMIN FUNCTIONS */

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    /* EVENTS */

    event Mint(address indexed recipient, uint256 tokenId, string tokenURI);
}
