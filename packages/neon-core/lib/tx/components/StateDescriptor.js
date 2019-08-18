import { hexstring2str, num2hexstring, num2VarInt, str2hexstring, StringStream } from "../../u";
export var StateType;
(function (StateType) {
    StateType[StateType["Account"] = 64] = "Account";
    StateType[StateType["Validator"] = 72] = "Validator";
})(StateType || (StateType = {}));
function toStateType(type) {
    if (typeof type === "string") {
        if (type in StateType) {
            return StateType[type];
        }
        throw new Error(`${type} not found in StateType!`);
    }
    return type;
}
export class StateDescriptor {
    static deserialize(hex) {
        const ss = new StringStream(hex);
        return this.fromStream(ss);
    }
    static fromStream(ss) {
        const type = parseInt(ss.read(), 16);
        const key = ss.readVarBytes();
        const field = hexstring2str(ss.readVarBytes());
        const value = ss.readVarBytes();
        return new StateDescriptor({ type, key, field, value });
    }
    constructor(obj = {}) {
        this.type = obj.type ? toStateType(obj.type) : StateType.Account;
        this.key = obj.key || "";
        this.field = obj.field || "";
        this.value = obj.value || "";
    }
    get [Symbol.toStringTag]() {
        return "StateDescriptor";
    }
    serialize() {
        let out = num2hexstring(this.type);
        out += num2VarInt(this.key.length / 2);
        out += this.key;
        const hexField = str2hexstring(this.field);
        out += num2VarInt(hexField.length / 2);
        out += hexField;
        out += num2VarInt(this.value.length / 2);
        out += this.value;
        return out;
    }
    export() {
        return {
            type: this.type,
            key: this.key,
            field: this.field,
            value: this.value
        };
    }
    equals(other) {
        return (this.type === toStateType(other.type) &&
            this.key === other.key &&
            this.field === other.field &&
            this.value === other.value);
    }
}
export default StateDescriptor;
//# sourceMappingURL=StateDescriptor.js.map