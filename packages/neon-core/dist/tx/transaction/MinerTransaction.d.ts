import { StringStream } from "../../u";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
import TransactionType from "./TransactionType";
export interface MinerTransactionLike extends TransactionLike {
    nonce: number;
}
export interface MinerExclusive {
    nonce: number;
}
export declare class MinerTransaction extends BaseTransaction {
    static deserializeExclusive(ss: StringStream, tx: Partial<MinerTransactionLike>): Partial<MinerTransactionLike>;
    nonce: number;
    readonly type: TransactionType;
    constructor(obj?: Partial<MinerTransactionLike>);
    readonly exclusiveData: MinerExclusive;
    readonly fees: number;
    serializeExclusive(): string;
    export(): MinerTransactionLike;
    equals(other: Partial<TransactionLike>): boolean;
}
export default MinerTransaction;
//# sourceMappingURL=MinerTransaction.d.ts.map