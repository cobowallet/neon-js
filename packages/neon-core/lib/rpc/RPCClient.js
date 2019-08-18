var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DEFAULT_RPC, NEO_NETWORK, RPC_VERSION } from "../consts";
import logger from "../logging";
import { timeout } from "../settings";
import { isAddress, Claims, Balance, Coin } from "../wallet";
import Query from "./Query";
const log = logger("rpc");
const versionRegex = /NEO:(\d+\.\d+\.\d+)/;
/**
 * RPC Client model to query a NEO node. Contains built-in methods to query using RPC calls.
 */
export class RPCClient {
    /**
     * @param net 'MainNet' or 'TestNet' will query the default RPC address found in consts. You may provide a custom URL.
     * @param version Version of NEO node. Used to check if RPC methods have been implemented. it will default to DEFAULT_RPC found in CONST
     */
    constructor(net, version = RPC_VERSION) {
        if (net === NEO_NETWORK.MAIN) {
            this.net = DEFAULT_RPC.MAIN;
        }
        else if (net === NEO_NETWORK.TEST) {
            this.net = DEFAULT_RPC.TEST;
        }
        else {
            this.net = net;
        }
        this.history = [];
        this.lastSeenHeight = 0;
        this._latencies = [];
        this.version = version;
    }
    get [Symbol.toStringTag]() {
        return "RPC Client";
    }
    get latency() {
        if (this._latencies.length === 0) {
            return 99999;
        }
        return Math.floor(this._latencies.reduce((p, c) => p + c, 0) / this._latencies.length);
    }
    set latency(lat) {
        if (this._latencies.length > 4) {
            this._latencies.shift();
        }
        this._latencies.push(lat);
    }
    /**
     * Measures the latency using getBlockCount call. Returns the current latency. For average, call this.latency
     */
    ping() {
        return __awaiter(this, void 0, void 0, function* () {
            const timeStart = Date.now();
            const query = Query.getBlockCount();
            try {
                const response = yield this.execute(query, { timeout: timeout.ping });
                this.lastSeenHeight = response.result;
                const newPing = Date.now() - timeStart;
                this.latency = newPing;
                return newPing;
            }
            catch (err) {
                this.latency = timeout.ping;
                return timeout.ping;
            }
        });
    }
    /**
     * Takes an Query object and executes it. Adds the Query object to history.
     */
    execute(query, config) {
        this.history.push(query);
        log.info(`RPC: ${this.net} executing Query[${query.req.method}]`);
        return query.execute(this.net, config);
    }
    /**
     * Creates a query with the given req and immediately executes it.
     */
    query(req, config) {
        const query = new Query(req);
        return this.execute(query, config);
    }
    /**
     * Gets the state of an account given an address.
     */
    getAccountState(addr) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isAddress(addr)) {
                throw new Error(`Invalid address given: ${addr}`);
            }
            const response = yield this.execute(Query.getAccountState(addr));
            return response.result;
        });
    }
    /**
     * Gets the state of an asset given an id.
     */
    getAssetState(assetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.getAssetState(assetId));
            return response.result;
        });
    }
    /**
     * Gets the block at a given height or hash.
     */
    getBlock(indexOrHash, verbose = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.getBlock(indexOrHash, verbose));
            return response.result;
        });
    }
    /**
     * Gets the block hash at a given height.
     */
    getBlockHash(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.getBlockHash(index));
            return response.result;
        });
    }
    /**
     * Get the latest block hash.
     */
    getBestBlockHash() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.getBestBlockHash());
            return response.result;
        });
    }
    /**
     * Get the current block height.
     */
    getBlockCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.getBlockCount());
            return response.result;
        });
    }
    /**
     * Get the system fees of a block.
     * @param {number} index
     * @return {Promise<string>} - System fees as a string.
     */
    getBlockSysFee(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.getBlockSysFee(index));
            return response.result;
        });
    }
    /**
     * Gets the number of peers this node is connected to.
     * @return {Promise<number>}
     */
    getConnectionCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.getConnectionCount());
            return response.result;
        });
    }
    /**
     * Gets the state of the contract at the given scriptHash.
     */
    getContractState(scriptHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.getContractState(scriptHash));
            return response.result;
        });
    }
    /**
     * Gets a list of all peers that this node has discovered.
     */
    getPeers() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.getPeers());
            return response.result;
        });
    }
    /**
     * Gets a list of all transaction hashes waiting to be processed.
     */
    getRawMemPool() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.getRawMemPool());
            return response.result;
        });
    }
    /**
     * Gets a transaction based on its hash.
     */
    getRawTransaction(txid, verbose = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.getRawTransaction(txid, verbose));
            return response.result;
        });
    }
    /**
     * Gets the corresponding value of a key in the storage of a contract address.
     */
    getStorage(scriptHash, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.getStorage(scriptHash, key));
            return response.result;
        });
    }
    /**
     * Gets the transaction output given a transaction id and index
     */
    getTxOut(txid, index) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.getTxOut(txid, index));
            return response.result;
        });
    }
    /**
     * Gets the list of validators available for voting.
     */
    getValidators() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.getValidators());
            return response.result;
        });
    }
    /**
     * Gets the version of the NEO node. This method will never be blocked by version. This method will also update the current Client's version to the one received.
     */
    getVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.execute(Query.getVersion());
                if (response && response.result && response.result.useragent) {
                    const useragent = response.result.useragent;
                    const responseLength = useragent.length;
                    const strippedResponse = useragent.substring(1, responseLength - 1);
                    const [header, newVersion] = strippedResponse.split(":");
                    this.version = newVersion;
                }
                else {
                    throw new Error("Empty or unexpected version pattern");
                }
                return this.version;
            }
            catch (err) {
                if (err.message.includes("Method not found")) {
                    this.version = RPC_VERSION;
                    return this.version;
                }
                else {
                    throw err;
                }
            }
        });
    }
    /**
     * Calls a smart contract with the given parameters. This method is a local invoke, results are not reflected on the blockchain.
     */
    invoke(scriptHash, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.invoke(scriptHash, ...params));
            return response.result;
        });
    }
    /**
     * Submits a contract method call with parameters for the node to run. This method is a local invoke, results are not reflected on the blockchain.
     */
    invokeFunction(scriptHash, operation, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.invokeFunction(scriptHash, operation, ...params));
            return response.result;
        });
    }
    /**
     * Submits a script for the node to run. This method is a local invoke, results are not reflected on the blockchain.
     */
    invokeScript(script) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.invokeScript(script));
            return response.result;
        });
    }
    /**
     * Sends a serialized transaction to the network.
     */
    sendRawTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.sendRawTransaction(transaction));
            return response.result;
        });
    }
    /**
     * Submits a serialized block to the network.
     */
    submitBlock(block) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.submitBlock(block));
            return response.result;
        });
    }
    /**
     * Checks if the provided address is a valid NEO address.
     */
    validateAddress(addr) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.validateAddress(addr));
            return response.result.isvalid;
        });
    }
    /**
     * Get the unspent utxo for an address
     */
    getUnspents(addr) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.getUnspents(addr));
            return this.parseUnspentsToBalance(response.result);
        });
    }
    /**
     * Get the unclaimed gas amount for an address
     */
    getUnclaimed(addr) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.getUnclaimed(addr));
            return response.result;
        });
    }
    /**
     * Get the claimable for an address
     */
    getClaimable(addr) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query.getClaimable(addr));
            return new Claims({
                net: this.net,
                address: response.result.address,
                claims: response.result.claimable.map((rawClaim) => new Object({
                    claim: rawClaim.unclaimed,
                    txid: rawClaim.txid,
                    index: rawClaim.n,
                    value: rawClaim.value,
                    start: rawClaim.start_height,
                    end: rawClaim.end_height
                }))
            });
        });
    }
    parseUnspentsToBalance(getUnspentsResult) {
        const bal = new Balance({
            address: getUnspentsResult.address
        });
        for (const assetBalance of getUnspentsResult.balance) {
            if (assetBalance.amount === 0) {
                continue;
            }
            if (assetBalance.unspent.length > 0) {
                bal.addAsset(assetBalance.asset_symbol, {
                    unspent: assetBalance.unspent.map((utxo) => new Coin({
                        index: utxo.n,
                        txid: utxo.txid,
                        value: utxo.value
                    }))
                });
            }
            else {
                bal.addToken(assetBalance.asset_symbol, assetBalance.amount);
            }
        }
        return bal;
    }
}
export default RPCClient;
//# sourceMappingURL=RPCClient.js.map