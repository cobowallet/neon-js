var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { logging, rpc, sc, u } from "@cityofzion/neon-core";
const log = logging.default("neon-domain");
const operation = "resolve";
/**
 * Resolve a domain to a public address.
 * @param url - URL of an NEO RPC service.
 * @param contract - the contract used to resolve
 * @param domain - the domain to resolve.
 * @return public address as string
 */
export function resolveDomain(url, contract, domain) {
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
        const hashSubdomain = u.sha256(u.str2hexstring(subdomain));
        const hashDomain = u.sha256(u.str2hexstring(tld));
        const hashName = u.sha256(hashSubdomain.concat(hashDomain));
        const parsedName = sc.ContractParam.byteArray(hashName, "name");
        const args = [protocol, parsedName, empty];
        const sb = new sc.ScriptBuilder();
        const script = sb.emitAppCall(contract, operation, args).str;
        const res = yield rpc.Query.invokeScript(script).execute(url);
        return rpc.StringParser(res.result.stack[0]);
    });
}
//# sourceMappingURL=core.js.map