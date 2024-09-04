// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ISchemaResolver} from "./ISchemaResolver.sol";
import {Attestation} from "./Types.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SchemaResolver is ISchemaResolver, EIP712{
    address public signer;
    bytes32 private constant _ATTEST_TYPEHASH = keccak256("Attest(uint64 employId,uint deadline,bool interviewPassed,uint8 skillCategory,uint8 skillLevel)");

    event Attest(uint64 employId, uint deadline, bool interviewPassed, uint8 skillCategory, uint8 skillLevel, bytes32, bytes);

    constructor() EIP712("Resolver", "1.0.0") {
        signer = msg.sender;
    }

    function isPayable() external pure returns (bool){
        return false;
    }

    function _attest(Attestation calldata attestation) private{
        (uint64 employId, bool interviewPassed, uint8 skillCategory, uint8 skillLevel, bytes memory _ext) 
            = abi.decode(attestation.data, (uint64, bool, uint8, uint8, bytes));

        (uint deadline, bytes memory signature) = abi.decode(_ext, (uint, bytes));

        if (block.timestamp > deadline) {
            revert("SchemaResolver: Signature Expired");
        }

        bytes32 structHash = keccak256(abi.encode(_ATTEST_TYPEHASH, employId, deadline, interviewPassed, skillCategory, skillLevel));

        bytes32 hash = _hashTypedDataV4(structHash);
    
        require(ECDSA.recover(hash, signature) == signer, "SchemaResolver: Signature Invalid");
        emit Attest(employId, deadline, interviewPassed, skillCategory, skillLevel, hash, signature);
    } 

    function attest(Attestation calldata attestation) external payable returns(bool){
        _attest(attestation);
        return true;
    }

    function multiAttest(
        Attestation[] calldata attestations,
        uint256[] calldata values
    ) external payable returns (bool){
        for(uint i = 0; i < attestations.length; i++){
            _attest(attestations[i]);
        }
        return true;
    }

    function revoke(Attestation calldata attestation) external payable returns (bool){
        return true;
    }

    function multiRevoke(
        Attestation[] calldata attestations,
        uint256[] calldata values
    ) external payable returns (bool){
        return true;
    }
}
