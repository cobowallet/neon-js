"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const neon_core_1 = require("@cityofzion/neon-core");
const core_1 = require("./core");
const log = neon_core_1.logging.default("neon-domain");
class NeoNS {
    get name() {
        return `NeoNs[${this.contract}]`;
    }
    constructor(contract) {
        this.contract = contract;
        log.info(`Created NeoNS Provider: ${this.contract}`);
    }
    resolveDomain(url, domain) {
        return core_1.resolveDomain(url, this.contract, domain);
    }
}
exports.NeoNS = NeoNS;
exports.default = NeoNS;
//# sourceMappingURL=class.js.map