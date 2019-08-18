import { TX_VERSION } from "../../consts";
import { ASSET_ID, DEFAULT_SYSFEE } from "../../consts";
import { BaseTransaction } from "./BaseTransaction";
import TransactionType from "./TransactionType";
export class IssueTransaction extends BaseTransaction {
    constructor(obj = {}) {
        super(Object.assign({ version: TX_VERSION.ISSUE }, obj));
        this.type = TransactionType.IssueTransaction;
    }
    static deserializeExclusive(ss, tx) {
        return {};
    }
    get exclusiveData() {
        return {};
    }
    get fees() {
        if (this.version >= 1) {
            return 0;
        }
        if (this.outputs.every(p => p.assetId === ASSET_ID.NEO || p.assetId === ASSET_ID.GAS)) {
            return 0;
        }
        return DEFAULT_SYSFEE.issueTransaction;
    }
    serializeExclusive() {
        return "";
    }
    equals(other) {
        if (this.type !== other.type) {
            return false;
        }
        if (other instanceof IssueTransaction) {
            return this.hash === other.hash;
        }
        return this.hash === new IssueTransaction(other).hash;
    }
}
export default IssueTransaction;
//# sourceMappingURL=IssueTransaction.js.map