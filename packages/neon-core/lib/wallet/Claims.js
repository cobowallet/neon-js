import util from "util";
import ClaimItem from "./components/ClaimItem";
const inspect = util.inspect.custom;
/**
 * Claims object used for claiming GAS.
 */
export class Claims {
    constructor(config = {}) {
        this.address = config.address || "";
        this.net = config.net || "NoNet";
        this.claims = config.claims ? config.claims.map(c => new ClaimItem(c)) : [];
    }
    get [Symbol.toStringTag]() {
        return "Claims";
    }
    [inspect]() {
        const claimsDump = this.claims.map(c => {
            return `${c.txid} <${c.index}>: ${c.claim.toString()}`;
        });
        return `[Claims(${this.net}): ${this.address}]\n${JSON.stringify(claimsDump, null, 2)}`;
    }
    export() {
        return {
            address: this.address,
            net: this.net,
            claims: this.claims.map(c => c.export())
        };
    }
    /**
     * Returns new Claims object that contains part of the total claims starting at start, ending at end.
     */
    slice(start, end) {
        return new Claims({
            address: this.address,
            net: this.net,
            claims: this.claims.slice(start, end)
        });
    }
}
export default Claims;
//# sourceMappingURL=Claims.js.map