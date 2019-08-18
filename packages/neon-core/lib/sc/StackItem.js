import { StringStream } from "../u";
export var StackItemType;
(function (StackItemType) {
    StackItemType[StackItemType["ByteArray"] = 0] = "ByteArray";
    StackItemType[StackItemType["Boolean"] = 1] = "Boolean";
    StackItemType[StackItemType["Integer"] = 2] = "Integer";
    StackItemType[StackItemType["InteropInterface"] = 4] = "InteropInterface";
    StackItemType[StackItemType["Array"] = 128] = "Array";
    StackItemType[StackItemType["Struct"] = 129] = "Struct";
    StackItemType[StackItemType["Map"] = 130] = "Map";
})(StackItemType || (StackItemType = {}));
function toStackItemType(type) {
    if (typeof type === "string") {
        return StackItemType[type];
    }
    return type;
}
/**
 * Determine if there's a nested set based on type
 */
export function hasChildren(type) {
    if (type === StackItemType.Array ||
        type === StackItemType.Struct ||
        type === StackItemType.Map) {
        return true;
    }
    return false;
}
function getDefaultValue(type) {
    switch (type) {
        case StackItemType.Array:
        case StackItemType.Struct:
        case StackItemType.Map:
            return [];
        case StackItemType.Boolean:
            return false;
        default:
            return "";
    }
}
/**
 * Object returned as a result of executing a script in the VM.
 */
export class StackItem {
    static deserialize(hex) {
        const ss = new StringStream(hex);
        return this._deserialize(ss);
    }
    static _deserialize(ss) {
        const item = new StackItem({ type: parseInt(ss.read(), 16) });
        const l = ss.readVarInt();
        if (l === 0) {
            item.value = getDefaultValue(item.type);
            return item;
        }
        switch (item.type) {
            case StackItemType.Array:
            case StackItemType.Struct:
                item.value = [];
                for (let i = 0; i < l; i++) {
                    item.value.push(this._deserialize(ss));
                }
                break;
            case StackItemType.Map:
                item.value = [];
                for (let i = 0; i < l; i++) {
                    item.value.push({
                        key: this._deserialize(ss),
                        value: this._deserialize(ss)
                    });
                }
                break;
            case StackItemType.Boolean:
                item.value = parseInt(ss.read(), 16) > 0;
                break;
            default:
                item.value = ss.read(l);
        }
        return item;
    }
    constructor(obj) {
        if (obj.type === undefined) {
            throw new Error(`Invalid type provided: ${obj.type}`);
        }
        this.type = toStackItemType(obj.type);
        if (obj.value === undefined) {
            this.value = getDefaultValue(this.type);
        }
        else if (Array.isArray(obj.value)) {
            if (this.type === StackItemType.Array) {
                this.value = obj.value.map(v => new StackItem(v));
            }
            else if (this.type === StackItemType.Map) {
                this.value = obj.value.map(v => ({
                    key: new StackItem(v.key),
                    value: new StackItem(v.value)
                }));
            }
            throw new Error(`Encountered array for value but invalid type`);
        }
        else {
            this.value = obj.value;
        }
    }
    export() {
        const type = StackItemType[this.type];
        switch (this.type) {
            case StackItemType.Array:
            case StackItemType.Struct:
                return {
                    type,
                    value: this.value.map(i => i.export())
                };
            case StackItemType.Map:
                return {
                    type,
                    value: this.value.map(kv => ({
                        key: kv.key.export(),
                        value: kv.value.export()
                    }))
                };
            default:
                return { type, value: this.value };
        }
    }
}
export default StackItem;
//# sourceMappingURL=StackItem.js.map