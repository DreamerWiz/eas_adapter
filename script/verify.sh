forge verify-contract --verifier blockscout \
  --verifier-url "http://localhost:4000/api?module=contract&action=veirfy" "0x9BD1f36608583C3ec8100EA7171D1daD1a692d80"  src/resolver/SchemaResolver.sol:SchemaResolver

# forge verify-contract --verifier blockscout \
  # --verifier-url "http://localhost:4000/api?module=contract&action=veirfy" "0xeb530697f88288b4d401C698cEc414629c356353"  src/EAS/EAS.sol:EAS
