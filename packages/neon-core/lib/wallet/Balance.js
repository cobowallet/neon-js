var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ASSETS } from "../consts";
import { Query } from "../rpc";
import { Transaction } from "../tx";
import { BaseTransaction } from "../tx/transaction/BaseTransaction";
import Fixed8 from "../u/Fixed8";
import AssetBalance from "./components/AssetBalance";
import Coin from "./components/Coin";
function verifyCoin(url, c) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield Query.getTxOut(c.txid, c.index).execute(url);
        if (!response.result) {
            return false;
        }
        return c.index === response.result.n && c.value.equals(response.result.value);
    });
}
/**
 * Verifies a list of Coins
 * @param url RPC Node to verify against.
 * @param coinArr Coins to verify.
 */
function verifyCoins(url, coinArr) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = coinArr.map(c => verifyCoin(url, c));
        return yield Promise.all(promises);
    });
}
/**
 * Verifies an AssetBalance
 * @param url RPC Node to verify against.
 * @param assetBalance AssetBalance to verify.
 */
function verifyAssetBalance(url, assetBalance) {
    return __awaiter(this, void 0, void 0, function* () {
        const newAssetBalance = {
            balance: new Fixed8(0),
            spent: [],
            unspent: [],
            unconfirmed: []
        };
        const validCoins = yield verifyCoins(url, assetBalance.unspent);
        validCoins.forEach((valid, i) => {
            const coin = assetBalance.unspent[i];
            if (valid) {
                newAssetBalance.unspent.push(coin);
                newAssetBalance.balance = newAssetBalance.balance.add(coin.value);
            }
            else {
                newAssetBalance.spent.push(coin);
            }
        });
        return new AssetBalance(newAssetBalance);
    });
}
function exportAssets(assets) {
    const output = {};
    const keys = Object.keys(assets);
    for (const key of keys) {
        output[key] = assets[key].export();
    }
    return output;
}
function exportTokens(tokens) {
    const out = {};
    Object.keys(tokens).forEach(symbol => {
        out[symbol] = tokens[symbol].toNumber();
    });
    return out;
}
/**
 * Represents a balance available for an Account.
 * Contains balances for both UTXO assets and NEP5 tokens.
 */
export class Balance {
    constructor(bal = {}) {
        this.address = bal.address || "";
        this.net = bal.net || "NoNet";
        this.assetSymbols = [];
        this.assets = {};
        if (typeof bal.assets === "object") {
            const keys = Object.keys(bal.assets);
            for (const key of keys) {
                if (typeof bal.assets[key] === "object") {
                    this.addAsset(key, bal.assets[key]);
                }
            }
        }
        this.tokenSymbols = [];
        this.tokens = {};
        if (typeof bal.tokens === "object") {
            const keys = Object.keys(bal.tokens);
            for (const key of keys) {
                this.addToken(key, bal.tokens[key]);
            }
        }
    }
    get [Symbol.toStringTag]() {
        return "Balance";
    }
    /**
     * Adds a new asset to this Balance.
     * @param  sym The symbol to refer by. This function will force it to upper-case.
     * @param assetBalance The assetBalance if initialized. Default is a zero balance object.
     */
    addAsset(sym, assetBalance) {
        sym = sym.toUpperCase();
        this.assetSymbols.push(sym);
        this.assetSymbols.sort();
        const cleanedAssetBalance = new AssetBalance(assetBalance);
        this.assets[sym] = cleanedAssetBalance;
        return this;
    }
    /**
     * Adds a new NEP-5 Token to this Balance.
     * @param sym - The NEP-5 Token Symbol to refer by.
     * @param tokenBalance - The amount of tokens this account holds.
     */
    addToken(sym, tokenBalance = 0) {
        sym = sym.toUpperCase();
        this.tokenSymbols.push(sym);
        this.tokens[sym] = new Fixed8(tokenBalance);
        return this;
    }
    /**
     * Applies a Transaction to a Balance, removing spent coins and adding new coins. This currently applies only to Assets.
     * @param tx Transaction that has been sent and accepted by Node.
     * @param confirmed If confirmed, new coins will be added to unspent. Else, new coins will be added to unconfirmed property first.
     */
    applyTx(tx, confirmed = false) {
        tx = tx instanceof BaseTransaction ? tx : Transaction.deserialize(tx);
        const symbols = this.assetSymbols;
        // Spend coins
        for (const input of tx.inputs) {
            const findFunc = (el) => el.txid === input.prevHash && el.index === input.prevIndex;
            for (const sym of symbols) {
                const assetBalance = this.assets[sym];
                const ind = assetBalance.unspent.findIndex(findFunc);
                if (ind >= 0) {
                    const spentCoin = assetBalance.unspent.splice(ind, 1);
                    assetBalance.spent = assetBalance.spent.concat(spentCoin);
                    break;
                }
            }
        }
        // Add new coins
        const hash = tx.hash;
        for (let i = 0; i < tx.outputs.length; i++) {
            const output = tx.outputs[i];
            const sym = ASSETS[output.assetId];
            const assetBalance = this.assets[sym];
            if (!assetBalance) {
                this.addAsset(sym);
            }
            const coin = new Coin({ index: i, txid: hash, value: output.value });
            if (confirmed) {
                const findFunc = (el) => el.txid === coin.txid && el.index === coin.index;
                const unconfirmedIndex = assetBalance.unconfirmed.findIndex(findFunc);
                if (unconfirmedIndex >= 0) {
                    assetBalance.unconfirmed.splice(unconfirmedIndex, 1);
                }
                if (!assetBalance.unspent) {
                    assetBalance.unspent = [];
                }
                assetBalance.unspent.push(coin);
            }
            else {
                if (!assetBalance.unconfirmed) {
                    assetBalance.unconfirmed = [];
                }
                assetBalance.unconfirmed.push(coin);
            }
            this.assets[sym] = assetBalance;
        }
        return this;
    }
    /**
     * Informs the Balance that the next block is confirmed, thus moving all unconfirmed transaction to unspent.
     */
    confirm() {
        for (const sym of this.assetSymbols) {
            const assetBalance = this.assets[sym];
            assetBalance.unspent = assetBalance.unspent.concat(assetBalance.unconfirmed);
            assetBalance.unconfirmed = [];
        }
        return this;
    }
    /**
     * Export this class as a plain JS object
     */
    export() {
        return {
            net: this.net,
            address: this.address,
            assetSymbols: this.assetSymbols,
            assets: exportAssets(this.assets),
            tokenSymbols: this.tokenSymbols,
            tokens: exportTokens(this.tokens)
        };
    }
    /**
     * Verifies the coins in balance are unspent. This is an expensive call.
     *
     * Any coins categorised incorrectly are moved to their correct arrays.
     * @param url NEO Node to check against.
     */
    verifyAssets(url) {
        const promises = [];
        const symbols = this.assetSymbols;
        symbols.map(key => {
            const assetBalance = this.assets[key];
            promises.push(verifyAssetBalance(url, assetBalance));
        });
        return Promise.all(promises).then(newBalances => {
            symbols.map((sym, i) => {
                this.assets[sym] = newBalances[i];
            });
            return this;
        });
    }
}
export default Balance;
//# sourceMappingURL=Balance.js.map