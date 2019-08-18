import { TX_VERSION } from "../../consts";
import { num2hexstring, reverseHex } from "../../u";
import { BaseTransaction } from "./BaseTransaction";
export class MinerTransaction extends BaseTransaction {
    constructor(obj = {}) {
        super(Object.assign({ version: TX_VERSION.MINER }, obj));
        this.type = 0x00;
        this.nonce = obj.nonce || 0;
    }
    static deserializeExclusive(ss, tx) {
        // read Uint32 from StringStream
        const nonce = parseInt(reverseHex(ss.read(4)), 16);
        return Object.assign(tx, { nonce });
    }
    get exclusiveData() {
        return { nonce: this.nonce };
    }
    get fees() {
        return 0;
    }
    serializeExclusive() {
        return num2hexstring(this.nonce, 4, true);
    }
    export() {
        return Object.assign(super.export(), {
            nonce: this.nonce
        });
    }
    equals(other) {
        if (this.type !== other.type) {
            return false;
        }
        if (other instanceof MinerTransaction) {
            return this.hash === other.hash;
        }
        return this.hash === new MinerTransaction(other).hash;
    }
}
export default MinerTransaction;
//# sourceMappingURL=MinerTransaction.js.map