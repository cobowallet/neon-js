import { StringStream } from "../../u";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
import TransactionType from "./TransactionType";
export interface EnrollmentTransactionLike extends TransactionLike {
    publicKey: string;
}
export interface EnrollementExclusive {
    publicKey: string;
}
export declare class EnrollmentTransaction extends BaseTransaction {
    static deserializeExclusive(ss: StringStream, tx: Partial<TransactionLike>): Partial<EnrollmentTransactionLike>;
    publicKey: string;
    readonly type: TransactionType;
    constructor(obj?: Partial<EnrollmentTransactionLike>);
    readonly exclusiveData: EnrollementExclusive;
    readonly fees: number;
    serializeExclusive(): string;
    export(): EnrollmentTransactionLike;
    equals(other: Partial<TransactionLike>): boolean;
}
export default EnrollmentTransaction;
//# sourceMappingURL=EnrollmentTransaction.d.ts.map