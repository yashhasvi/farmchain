// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FarmChain {
    struct Product {
        uint256 id;
        string name;
        uint256 quantity;
        uint256 harvestDate;
        address owner;
    }

    mapping(uint256 => Product) public products;
    mapping(address => uint256[]) public ownerToProducts;
    uint256 public nextProductId;

    event ProductCreated(
        uint256 indexed id,
        string name,
        uint256 quantity,
        uint256 harvestDate,
        address indexed owner
    );

    function createProduct(
        string memory name,
        uint256 quantity,
        uint256 harvestDate
    ) public {
        products[nextProductId] = Product(
            nextProductId,
            name,
            quantity,
            harvestDate,
            msg.sender
        );
        ownerToProducts[msg.sender].push(nextProductId);
        emit ProductCreated(
            nextProductId,
            name,
            quantity,
            harvestDate,
            msg.sender
        );
        nextProductId++;
    }

    function getProductsByOwner(
        address owner
    ) public view returns (uint256[] memory) {
        return ownerToProducts[owner];
    }

    function getProductHistory(
        uint256 productId
    )
        public
        view
        returns (
            uint256 id,
            string memory name,
            uint256 quantity,
            uint256 harvestDate,
            address owner
        )
    {
        Product memory p = products[productId];
        return (p.id, p.name, p.quantity, p.harvestDate, p.owner);
    }
}
