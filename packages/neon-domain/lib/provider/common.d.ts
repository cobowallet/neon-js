export interface DomainProvider {
    readonly name: string;
    resolveDomain(url: string, domain: string): Promise<string>;
}
//# sourceMappingURL=common.d.ts.map