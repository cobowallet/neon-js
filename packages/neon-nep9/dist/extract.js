"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const neon_core_1 = require("@cityofzion/neon-core");
const requiresProcessing = [
    neon_core_1.tx.TxAttrUsage.Description,
    neon_core_1.tx.TxAttrUsage.DescriptionUrl,
    neon_core_1.tx.TxAttrUsage.Remark,
    neon_core_1.tx.TxAttrUsage.Remark2,
    neon_core_1.tx.TxAttrUsage.Remark3,
    neon_core_1.tx.TxAttrUsage.Remark4,
    neon_core_1.tx.TxAttrUsage.Remark5,
    neon_core_1.tx.TxAttrUsage.Remark6,
    neon_core_1.tx.TxAttrUsage.Remark7,
    neon_core_1.tx.TxAttrUsage.Remark8,
    neon_core_1.tx.TxAttrUsage.Remark9,
    neon_core_1.tx.TxAttrUsage.Remark10,
    neon_core_1.tx.TxAttrUsage.Remark11,
    neon_core_1.tx.TxAttrUsage.Remark12,
    neon_core_1.tx.TxAttrUsage.Remark13,
    neon_core_1.tx.TxAttrUsage.Remark14,
    neon_core_1.tx.TxAttrUsage.Remark15
];
function extractAsset(params) {
    if (!params.asset) {
        return undefined;
    }
    switch (params.asset) {
        case "neo":
            return neon_core_1.CONST.ASSET_ID.NEO;
        case "gas":
            return neon_core_1.CONST.ASSET_ID.GAS;
        default:
            return params.asset;
    }
}
exports.extractAsset = extractAsset;
function extractAmount(params) {
    if (!params.amount) {
        return undefined;
    }
    return parseFloat(params.amount);
}
exports.extractAmount = extractAmount;
function processAscii(data) {
    return neon_core_1.u.str2hexstring(decodeURIComponent(data));
}
function matchAttribute(key, data) {
    const camelCasedKey = key.replace(/^[a-z]/, c => c.toUpperCase());
    if (camelCasedKey in neon_core_1.tx.TxAttrUsage) {
        const usage = neon_core_1.tx.TxAttrUsage[camelCasedKey];
        return {
            usage,
            data: requiresProcessing.indexOf(usage) >= 0 ? processAscii(data) : data
        };
    }
    switch (key) {
        case "ecdh02":
            return {
                usage: neon_core_1.tx.TxAttrUsage.ECDH02,
                data
            };
        case "ecdh03":
            return {
                usage: neon_core_1.tx.TxAttrUsage.ECDH03,
                data
            };
        default:
            return undefined;
    }
}
function extractAttributes(params) {
    const attributes = Object.keys(params).map(key => matchAttribute(key, params[key]));
    return attributes.filter(a => a);
}
exports.extractAttributes = extractAttributes;
//# sourceMappingURL=extract.js.map