import * as _Neon from "@cityofzion/neon-core";
import * as nep9 from "./plugin";
declare function bundle<T extends typeof _Neon>(neonCore: T): T & {
    nep9: typeof nep9;
};
export default bundle;
export * from "./plugin";
//# sourceMappingURL=index.d.ts.map