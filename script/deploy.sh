# forge create src/Registry/SchemaRegistry.sol:SchemaRegistry --private-key 0xa6887db5ecf37d7c9faac7592fc865df2eb1004ace79588cda8de171d27ad417 --rpc-url http://127.0.0.1:8545 --verify --verifier blockscout --verifier-url http://localhost:4000/api?module=contract&action=verify 

# forge create src/EAS/EAS.sol:EAS --constructor-args "0x047f7d108d18b291be5e51ab9c3c38730401f846" --private-key 0xa6887db5ecf37d7c9faac7592fc865df2eb1004ace79588cda8de171d27ad417 --rpc-url http://127.0.0.1:8545 --verify --verifier blockscout --verifier-url http://localhost:4000/api?module=contract&action=verify 

forge create src/resolver/SchemaResolver.sol:SchemaResolver --private-key 0xa6887db5ecf37d7c9faac7592fc865df2eb1004ace79588cda8de171d27ad417 --rpc-url http://127.0.0.1:8545 --verify --verifier blockscout --verifier-url http://localhost:4000/api?module=contract&action=verify 