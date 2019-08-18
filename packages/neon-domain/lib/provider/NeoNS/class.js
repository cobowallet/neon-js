import { logging } from "@cityofzion/neon-core";
import { resolveDomain } from "./core";
const log = logging.default("neon-domain");
export class NeoNS {
    get name() {
        return `NeoNs[${this.contract}]`;
    }
    constructor(contract) {
        this.contract = contract;
        log.info(`Created NeoNS Provider: ${this.contract}`);
    }
    resolveDomain(url, domain) {
        return resolveDomain(url, this.contract, domain);
    }
}
export default NeoNS;
//# sourceMappingURL=class.js.map