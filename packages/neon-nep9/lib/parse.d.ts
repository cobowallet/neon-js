import { tx } from "@cityofzion/neon-core";
/**
 * Intent as expressed by an NEP9 URI string
 */
export interface NEP9Intent {
    address: string;
    attributes: tx.TransactionAttributeLike[];
    asset?: string;
    amount?: number;
}
/**
 * Parses an NEP9 URI string into a consumable intent object. This function does not check for runtime validity conditions (eg address or contract validity).
 * @param uri Case sensitive URI string.
 */
export declare function parse(uri: string): NEP9Intent;
export default parse;
//# sourceMappingURL=parse.d.ts.map