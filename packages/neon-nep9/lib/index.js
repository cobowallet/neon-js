import * as nep9 from "./plugin";
function bundle(neonCore) {
    return Object.assign({}, neonCore, { nep9 });
}
export default bundle;
export * from "./plugin";
//# sourceMappingURL=index.js.map