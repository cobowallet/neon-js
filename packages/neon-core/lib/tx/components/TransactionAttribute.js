import { num2hexstring, num2VarInt, StringStream } from "../../u";
import { TxAttrUsage } from "../txAttrUsage";
const maxTransactionAttributeSize = 65535;
function toTxAttrUsage(type) {
    if (typeof type === "string") {
        if (type in TxAttrUsage) {
            return TxAttrUsage[type];
        }
        throw new Error(`${type} not found in TxAttrUsage!`);
    }
    return type;
}
/**
 * An attribute that is used to decorate the transaction.
 * Used for appending additional information to the transaction.
 *
 * For example, a remark is attached as an attribute.
 */
export class TransactionAttribute {
    static deserialize(hex) {
        const ss = new StringStream(hex);
        return this.fromStream(ss);
    }
    static fromStream(ss) {
        const usage = parseInt(ss.read(1), 16);
        let data;
        if (usage === 0x00 || usage === 0x30 || (usage >= 0xa1 && usage <= 0xaf)) {
            data = ss.read(32);
        }
        else if (usage === 0x02 || usage === 0x03) {
            data = num2hexstring(usage) + ss.read(32);
        }
        else if (usage === 0x20) {
            data = ss.read(20);
        }
        else if (usage === 0x81) {
            data = ss.read(parseInt(ss.read(1), 16));
        }
        else if (usage === 0x90 || usage >= 0xf0) {
            data = ss.readVarBytes();
        }
        else {
            throw new Error(`Unknown usage type: ${usage}. Context: ${ss.context()}`);
        }
        return new TransactionAttribute({ usage, data });
    }
    constructor(obj) {
        if (!obj || obj.usage === undefined || obj.data === undefined) {
            throw new Error("TransactionAttribute requires usage and data fields");
        }
        this.usage = toTxAttrUsage(obj.usage);
        this.data = obj.data;
    }
    get [Symbol.toStringTag]() {
        return "TransactionAttribute";
    }
    serialize() {
        if (this.data.length > maxTransactionAttributeSize) {
            throw new Error(`Data size too big!`);
        }
        let out = num2hexstring(this.usage);
        if (this.usage === 0x81) {
            out += num2hexstring(this.data.length / 2);
        }
        else if (this.usage === 0x90 || this.usage >= 0xf0) {
            out += num2VarInt(this.data.length / 2);
        }
        if (this.usage === 0x02 || this.usage === 0x03) {
            out += this.data.substr(2, 64);
        }
        else {
            out += this.data;
        }
        return out;
    }
    export() {
        return {
            usage: this.usage,
            data: this.data
        };
    }
    equals(other) {
        return (this.usage === toTxAttrUsage(other.usage) && this.data === other.data);
    }
}
export default TransactionAttribute;
//# sourceMappingURL=TransactionAttribute.js.map