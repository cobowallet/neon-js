import { DEFAULT_SYSFEE } from "../consts";
import { compareObject } from "../helper";
import logger from "../logging";
const log = logger("protocol");
function compareArrays(current, other) {
    if (current.length !== other.length) {
        return false;
    }
    for (let i = 0; i < current.length; i++) {
        if (current[i] !== other[i]) {
            return false;
        }
    }
    return true;
}
/**
 * Model of the protocol configuration file used by the C# implementation.
 */
export class Protocol {
    constructor(config = {}) {
        this.magic = config.magic || config.Magic || 0;
        this.addressVersion = config.addressVersion || config.AddressVersion || 23;
        this.standbyValidators =
            config.standbyValidators || config.StandbyValidators || [];
        this.seedList = config.seedList || config.SeedList || [];
        this.systemFee = Object.assign({}, config.systemFee || config.SystemFee || DEFAULT_SYSFEE);
    }
    get [Symbol.toStringTag]() {
        return "Protocol";
    }
    export() {
        return {
            Magic: this.magic,
            AddressVersion: this.addressVersion,
            StandbyValidators: this.standbyValidators,
            SeedList: this.seedList,
            SystemFee: this.systemFee
        };
    }
    equals(other) {
        return (this.magic === (other.magic || other.Magic) &&
            this.addressVersion === (other.addressVersion || other.AddressVersion) &&
            compareArrays(this.seedList, other.seedList || other.SeedList || []) &&
            compareArrays(this.standbyValidators, other.standbyValidators || other.StandbyValidators || []) &&
            compareObject(this.systemFee, other.systemFee || other.SystemFee || {}));
    }
}
export default Protocol;
//# sourceMappingURL=Protocol.js.map