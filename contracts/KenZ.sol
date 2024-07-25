// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KZToken is ERC721Enumerable, Ownable {
    uint256 public constant MAX_SUPPLY = 888;
    uint256 public constant PREMINT_AMOUNT = 100;

    constructor(address initialOwner) ERC721("KZToken", "KZ") Ownable(initialOwner) {
        for (uint256 i = 0; i < PREMINT_AMOUNT; i++) {
            _mint(initialOwner, i);
        }
    }

    function mint(address to, uint256 tokenId) external onlyOwner {
        require(totalSupply() < MAX_SUPPLY, "Max supply reached");
        _mint(to, tokenId);
    }
}
