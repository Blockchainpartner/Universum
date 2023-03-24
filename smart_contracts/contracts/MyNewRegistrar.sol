pragma solidity >=0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ENS.sol";

/**
 * A registrar that allocates subdomains to the first person to claim them.
 */
contract MyNewRegistrar is Ownable{
    ENS ens;
    bytes32 rootNode;
    address public relayer;

    modifier only_owner(bytes32 label) {
        address currentOwner = ens.owner(
            keccak256(abi.encodePacked(rootNode, label))
        );
        require(currentOwner == address(0x0) || currentOwner == msg.sender);
        _;
    }

    /**
     * Constructor.
     * @param ensAddr The address of the ENS registry.
     * @param node The node that this registrar administers.
     */
    constructor(ENS ensAddr, bytes32 node) {
        ens = ensAddr;
        rootNode = node;

    }

    /**
     * Register a name, or change the owner of an existing registration.
     * @param label The hash of the label to register.
     * @param owner The address of the new owner.
     */
    function register(bytes32 label, address owner) public payable only_owner(label) {
        require(msg.sender == relayer || msg.value > 0, "Requirements do not match");
        ens.setSubnodeOwner(rootNode, label, owner);  
    }

    /**
     * Set relayer address
     * @param _relayer The address of the new relayer.
     */
    function setRelayer(address _relayer) public onlyOwner(){
        relayer = _relayer;
    }
}
