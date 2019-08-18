import * as plugin from "./plugin";
function bundle(neonCore) {
    return Object.assign({}, neonCore, { domain: plugin });
}
export default bundle;
export * from "./plugin";
//# sourceMappingURL=index.js.map