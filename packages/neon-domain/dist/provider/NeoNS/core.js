"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const neon_core_1 = require("@cityofzion/neon-core");
const log = neon_core_1.logging.default("neon-domain");
const operation = "resolve";
/**
 * Resolve a domain to a public address.
 * @param url - URL of an NEO RPC service.
 * @param contract - the contract used to resolve
 * @param domain - the domain to resolve.
 * @return public address as string
 */
function resolveDomain(url, contract, domain) {
    return __awaiter(this, void 0, void 0, function* () {
        const protocol = {
            type: "String",
            value: "addr"
        };
        const empty = {
            type: "String",
            value: ""
        };
        const tld = domain.split(".").reverse()[0];
        const regExp = new RegExp(`.${tld}$`);
        const subdomain = domain.replace(regExp, "");
        const hashSubdomain = neon_core_1.u.sha256(neon_core_1.u.str2hexstring(subdomain));
        const hashDomain = neon_core_1.u.sha256(neon_core_1.u.str2hexstring(tld));
        const hashName = neon_core_1.u.sha256(hashSubdomain.concat(hashDomain));
        const parsedName = neon_core_1.sc.ContractParam.byteArray(hashName, "name");
        const args = [protocol, parsedName, empty];
        const sb = new neon_core_1.sc.ScriptBuilder();
        const script = sb.emitAppCall(contract, operation, args).str;
        const res = yield neon_core_1.rpc.Query.invokeScript(script).execute(url);
        return neon_core_1.rpc.StringParser(res.result.stack[0]);
    });
}
exports.resolveDomain = resolveDomain;
//# sourceMappingURL=core.js.map