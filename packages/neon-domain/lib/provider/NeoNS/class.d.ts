import { DomainProvider } from "../common";
export declare class NeoNS implements DomainProvider {
    private contract;
    readonly name: string;
    constructor(contract: string);
    resolveDomain(url: string, domain: string): Promise<string>;
}
export default NeoNS;
//# sourceMappingURL=class.d.ts.map