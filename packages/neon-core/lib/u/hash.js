import hexEncoding from "crypto-js/enc-hex";
import RIPEMD160 from "crypto-js/ripemd160";
import SHA256 from "crypto-js/sha256";
function hash(hex, hashingFunction) {
    const hexEncoded = hexEncoding.parse(hex);
    const result = hashingFunction(hexEncoded);
    return result.toString(hexEncoding);
}
/**
 * Performs a single SHA256.
 */
export function sha256(hex) {
    return hash(hex, SHA256);
}
/**
 * Performs a single RIPEMD160.
 */
export function ripemd160(hex) {
    return hash(hex, RIPEMD160);
}
/**
 * Performs a SHA256 followed by a RIPEMD160.
 */
export function hash160(hex) {
    const sha = sha256(hex);
    return ripemd160(sha);
    // const hexEncoded = safeParseHex(hex);
    // const ProgramSha256 = SHA256(hexEncoded);
    // return RIPEMD160(ProgramSha256.toString()).toString();
}
/**
 * Performs 2 SHA256.
 */
export function hash256(hex) {
    const firstSha = sha256(hex);
    return sha256(firstSha);
    // const hexEncoded = safeParseHex(hex);
    // const ProgramSha256 = SHA256(hexEncoded);
    // return SHA256(ProgramSha256).toString();
}
//# sourceMappingURL=hash.js.map