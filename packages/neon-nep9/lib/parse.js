import { wallet } from "@cityofzion/neon-core";
import { extractAmount, extractAsset, extractAttributes } from "./extract";
function validateScheme(scheme) {
    if (scheme !== "neo") {
        throw new Error("URI provided did not start with neo");
    }
}
function validatePath(path) {
    if (!path || !wallet.isAddress(path)) {
        throw new Error(`Invalid NEO address provided: ${path}`);
    }
}
function reduceParamsToDict(params) {
    const keyvalues = params ? params.split("&") : [];
    const baseDict = {};
    return keyvalues.reduce((obj, keyValuePair) => {
        const [key, val] = keyValuePair.split("=", 2);
        obj[key] = val;
        return obj;
    }, baseDict);
}
/**
 * Parses an NEP9 URI string into a consumable intent object. This function does not check for runtime validity conditions (eg address or contract validity).
 * @param uri Case sensitive URI string.
 */
export function parse(uri) {
    const [scheme, uriBody] = uri.split(":", 2);
    validateScheme(scheme);
    if (!uriBody) {
        throw new Error("URI did not contain anything after neo:");
    }
    const [path, queryParams] = uriBody.split("?", 2);
    validatePath(path);
    const params = reduceParamsToDict(queryParams);
    return {
        address: path,
        asset: extractAsset(params),
        amount: extractAmount(params),
        attributes: extractAttributes(params)
    };
}
export default parse;
//# sourceMappingURL=parse.js.map