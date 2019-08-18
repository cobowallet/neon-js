import { StringStream } from "../../u";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
import TransactionType from "./TransactionType";
export declare class IssueTransaction extends BaseTransaction {
    static deserializeExclusive(ss: StringStream, tx: Partial<TransactionLike>): Partial<TransactionLike>;
    readonly type: TransactionType;
    constructor(obj?: Partial<TransactionLike>);
    readonly exclusiveData: object;
    readonly fees: number;
    serializeExclusive(): string;
    equals(other: Partial<TransactionLike>): boolean;
}
export default IssueTransaction;
//# sourceMappingURL=IssueTransaction.d.ts.map