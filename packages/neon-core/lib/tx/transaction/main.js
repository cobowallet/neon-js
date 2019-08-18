import { num2VarInt } from "../../u";
import { TransactionAttribute, TransactionInput, TransactionOutput, Witness } from "../components";
export function deserializeArrayOf(type, ss) {
    const output = [];
    const len = ss.readVarInt();
    for (let i = 0; i < len; i++) {
        output.push(type(ss));
    }
    return output;
}
export function serializeArrayOf(prop) {
    return num2VarInt(prop.length) + prop.map(p => p.serialize()).join("");
}
export function deserializeType(ss, tx = {}) {
    const byte = ss.read();
    return Object.assign(tx, { type: parseInt(byte, 16) });
}
export function deserializeVersion(ss, tx = {}) {
    const byte = ss.read();
    return Object.assign({ version: parseInt(byte, 16) });
}
export function deserializeAttributes(ss, tx) {
    const attributes = deserializeArrayOf(TransactionAttribute.fromStream, ss).map(i => i.export());
    return Object.assign(tx, { attributes });
}
export function deserializeInputs(ss, tx) {
    const inputs = deserializeArrayOf(TransactionInput.fromStream, ss).map(i => i.export());
    return Object.assign(tx, { inputs });
}
export function deserializeOutputs(ss, tx) {
    const outputs = deserializeArrayOf(TransactionOutput.fromStream, ss).map(i => i.export());
    return Object.assign(tx, { outputs });
}
export function deserializeWitnesses(ss, tx) {
    const scripts = deserializeArrayOf(Witness.fromStream, ss).map(i => i.export());
    return Object.assign(tx, { scripts });
}
//# sourceMappingURL=main.js.map