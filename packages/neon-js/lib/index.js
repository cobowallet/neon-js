import apiPlugin from "@cityofzion/neon-api";
import * as neonCore from "@cityofzion/neon-core";
import nepPlugin from "@cityofzion/neon-nep5";
const neonWithApi = apiPlugin(neonCore);
const neonJs = nepPlugin(neonWithApi);
export const { api, nep5, settings, sc, rpc, wallet, CONST, u, tx, logging } = neonJs;
import defaultNetworks from "./networks";
const bootstrap = defaultNetworks;
Object.keys(bootstrap).map(key => {
    settings.networks[key] = new rpc.Network(bootstrap[key]);
});
/**
 * Semantic path for creation of a resource.
 */
const create = {
    account: (k) => new wallet.Account(k),
    privateKey: wallet.generatePrivateKey,
    signature: wallet.generateSignature,
    wallet: (k) => new wallet.Wallet(k),
    claimTx: () => new tx.ClaimTransaction(),
    contractTx: () => new tx.ContractTransaction(),
    invocationTx: () => new tx.InvocationTransaction(),
    stateTx: () => new tx.StateTransaction(),
    contractParam: (type, value) => new sc.ContractParam(type, value),
    script: sc.createScript,
    scriptBuilder: () => new sc.ScriptBuilder(),
    deployScript: (args) => sc.generateDeployScript(args),
    rpcClient: (net, version) => new rpc.RPCClient(net, version),
    query: (req) => new rpc.Query(req),
    network: (net) => new rpc.Network(net),
    stringStream: (str) => new u.StringStream(str),
    fixed8: (i) => new u.Fixed8(i)
};
/**
 * Semantic path for verification of a type.
 */
const is = {
    address: wallet.isAddress,
    publicKey: wallet.isPublicKey,
    encryptedKey: wallet.isNEP2,
    privateKey: wallet.isPrivateKey,
    wif: wallet.isWIF,
    scriptHash: wallet.isScriptHash
};
/**
 * Semantic path for deserialization of object.
 */
const deserialize = {
    attribute: tx.TransactionAttribute.deserialize,
    input: tx.TransactionInput.deserialize,
    output: tx.TransactionOutput.deserialize,
    script: tx.Witness.deserialize,
    tx: tx.Transaction.deserialize
};
/**
 * Semantic path for signing using private key.
 */
const sign = {
    hex: wallet.sign,
    message: (msg, privateKey) => {
        const hex = u.str2hexstring(msg);
        return wallet.sign(hex, privateKey);
    }
};
/**
 * Semantic path for verifying signatures using public key.
 */
const verify = {
    hex: wallet.verify,
    message: (msg, sig, publicKey) => {
        const hex = u.str2hexstring(msg);
        return wallet.verify(hex, sig, publicKey);
    }
};
export default {
    sendAsset: api.sendAsset,
    claimGas: api.claimGas,
    doInvoke: api.doInvoke,
    setupVote: api.setupVote,
    create,
    deserialize,
    is,
    sign,
    verify,
    encrypt: {
        privateKey: wallet.encrypt
    },
    decrypt: {
        privateKey: wallet.decrypt
    },
    add: {
        network: (network, override = false) => {
            if (override && settings.networks[network.name]) {
                return false;
            }
            settings.networks[network.name] = network;
            return true;
        }
    },
    remove: {
        network: (name) => {
            if (settings.networks[name]) {
                delete settings.networks[name];
                return true;
            }
            return false;
        }
    },
    u,
    CONST
};
//# sourceMappingURL=index.js.map