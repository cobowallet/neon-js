import { Fixed8, StringStream } from "../../u";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
import TransactionType from "./TransactionType";
export interface RegisterTransactionLike extends TransactionLike {
    assetType: number;
    name: string;
    amount: number | Fixed8;
    precision: number;
    owner: string;
    admin: string;
}
export interface RegisterExclusive {
    assetType: number;
    name: string;
    amount: Fixed8;
    precision: number;
    owner: string;
    admin: string;
}
export declare class RegisterTransaction extends BaseTransaction {
    static deserializeExclusive(ss: StringStream, tx: Partial<RegisterTransaction>): Partial<RegisterTransactionLike>;
    assetType: number;
    name: string;
    amount: Fixed8;
    precision: number;
    owner: string;
    admin: string;
    readonly type: TransactionType;
    constructor(obj?: Partial<RegisterTransactionLike>);
    readonly exclusiveData: RegisterExclusive;
    readonly fees: number;
    serializeExclusive(): string;
    export(): RegisterTransactionLike;
    equals(other: Partial<TransactionLike>): boolean;
}
export default RegisterTransaction;
//# sourceMappingURL=RegisterTransaction.d.ts.map