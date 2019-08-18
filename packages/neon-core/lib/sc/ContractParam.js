import { Fixed8, reverseHex } from "../u";
import { getScriptHashFromAddress, isAddress } from "../wallet";
export var ContractParamType;
(function (ContractParamType) {
    ContractParamType[ContractParamType["Signature"] = 0] = "Signature";
    ContractParamType[ContractParamType["Boolean"] = 1] = "Boolean";
    ContractParamType[ContractParamType["Integer"] = 2] = "Integer";
    ContractParamType[ContractParamType["Hash160"] = 3] = "Hash160";
    ContractParamType[ContractParamType["Hash256"] = 4] = "Hash256";
    ContractParamType[ContractParamType["ByteArray"] = 5] = "ByteArray";
    ContractParamType[ContractParamType["PublicKey"] = 6] = "PublicKey";
    ContractParamType[ContractParamType["String"] = 7] = "String";
    ContractParamType[ContractParamType["Array"] = 16] = "Array";
    ContractParamType[ContractParamType["InteropInterface"] = 240] = "InteropInterface";
    ContractParamType[ContractParamType["Void"] = 255] = "Void";
})(ContractParamType || (ContractParamType = {}));
function toContractParamType(type) {
    if (typeof type === "string") {
        if (type in ContractParamType) {
            return ContractParamType[type];
        }
        throw new Error(`${type} not found in ContractParamType!`);
    }
    return type;
}
/**
 * Contract input parameters.
 * These are mainly used as parameters to pass in for RPC test invokes.
 */
export class ContractParam {
    /**
     * Creates a String ContractParam.
     */
    static string(value) {
        return new ContractParam(ContractParamType.String, value);
    }
    /**
     * Creates a Boolean ContractParam. Does basic checks to convert value into a boolean.
     */
    static boolean(value) {
        return new ContractParam(ContractParamType.Boolean, !!value);
    }
    /**
     * Creates a Hash160 ContractParam. This is used for containing a scriptHash. Do not reverse the input if using this format.
     * @param {string} value - A 40 character long hexstring. Automatically converts an address to scripthash if provided.
     * @return {ContractParam}
     */
    static hash160(value) {
        if (typeof value !== "string") {
            throw new Error(`hash160 expected a string but got ${typeof value} instead.`);
        }
        if (isAddress(value)) {
            value = getScriptHashFromAddress(value);
        }
        if (value.length !== 40) {
            throw new Error(`hash160 expected a 40 character string but got ${value.length} chars instead.`);
        }
        return new ContractParam(ContractParamType.Hash160, value);
    }
    /**
     * Creates an Integer ContractParam. This is converted into an BigInteger in NeoVM.
     * @param {string | number } value - A value that can be parsed to an BigInteger. Numbers or numeric strings are accepted.
     * @example
     * ContractParam.integer(128)
     * ContractParam.integer("128")
     */
    static integer(value) {
        const num = typeof value === "string"
            ? value.split(".")[0]
            : Math.round(value).toString();
        return new ContractParam(ContractParamType.Integer, num);
    }
    /**
     * Creates a ByteArray ContractParam.
     * @param value
     * @param format The format that this value represents. Different formats are parsed differently.
     * @param args Additional arguments such as decimal precision
     */
    static byteArray(value, format, ...args) {
        if (format) {
            format = format.toLowerCase();
        }
        if (format === "address") {
            return new ContractParam(ContractParamType.ByteArray, reverseHex(getScriptHashFromAddress(value)));
        }
        else if (format === "fixed8") {
            let decimals = 8;
            if (args.length === 1) {
                decimals = args[0];
            }
            if (!isFinite(value)) {
                throw new Error(`Input should be number!`);
            }
            const divisor = new Fixed8(Math.pow(10, 8 - decimals));
            const fixed8Value = new Fixed8(value);
            const adjustedValue = fixed8Value.times(Math.pow(10, decimals));
            const modValue = adjustedValue.mod(1);
            if (!modValue.isZero()) {
                throw new Error(`wrong precision: expected ${decimals}`);
            }
            value = fixed8Value.div(divisor);
            return new ContractParam(ContractParamType.ByteArray, value.toReverseHex().slice(0, 16));
        }
        else {
            return new ContractParam(ContractParamType.ByteArray, value);
        }
    }
    /**
     * Creates an Array ContractParam.
     * @param params params to be encapsulated in an array.
     */
    static array(...params) {
        return new ContractParam(ContractParamType.Array, params);
    }
    constructor(type, value) {
        if (typeof type === "object") {
            this.type = toContractParamType(type.type);
            this.value = type.value;
        }
        else if (type !== undefined) {
            this.type = toContractParamType(type);
            this.value = value;
        }
        else {
            throw new Error("No constructor arguments provided!");
        }
    }
    get [Symbol.toStringTag]() {
        return "ContractParam:" + ContractParamType[this.type];
    }
    export() {
        const exportedValue = Array.isArray(this.value)
            ? this.value.map(cp => cp.export())
            : this.value;
        return { type: ContractParamType[this.type], value: this.value };
    }
    equal(other) {
        if (this.type === toContractParamType(other.type) &&
            Array.isArray(this.value) &&
            Array.isArray(other.value) &&
            this.value.length === other.value.length) {
            return this.value.every((cp, i) => cp.equal(other.value[i]));
        }
        return false;
    }
}
export default ContractParam;
export function likeContractParam(cp) {
    if (cp === null || cp === undefined) {
        return false;
    }
    if (cp instanceof ContractParam) {
        return true;
    }
    return (cp.type in ContractParamType &&
        cp.value !== null &&
        cp.value !== undefined);
}
//# sourceMappingURL=ContractParam.js.map