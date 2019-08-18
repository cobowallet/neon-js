import { ContractParamType } from "../../sc/ContractParam";
import { StringStream } from "../../u";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
import TransactionType from "./TransactionType";
export interface PublishTransactionLike extends TransactionLike {
    script: string;
    parameterList: ContractParamType[];
    returnType: ContractParamType;
    needStorage: boolean;
    name: string;
    codeVersion: string;
    author: string;
    email: string;
    description: string;
}
export interface PublishExclusive {
    script: string;
    parameterList: ContractParamType[];
    returnType: ContractParamType;
    needStorage: boolean;
    name: string;
    codeVersion: string;
    author: string;
    email: string;
    description: string;
}
export declare class PublishTransaction extends BaseTransaction {
    static deserializeExclusive(ss: StringStream, tx: Partial<TransactionLike>): Partial<PublishTransactionLike>;
    readonly type: TransactionType;
    script: string;
    parameterList: ContractParamType[];
    returnType: ContractParamType;
    needStorage: boolean;
    name: string;
    codeVersion: string;
    author: string;
    email: string;
    description: string;
    readonly exclusiveData: PublishExclusive;
    readonly fees: number;
    constructor(obj?: Partial<PublishTransactionLike>);
    serializeExclusive(): string;
    equals(other: Partial<TransactionLike>): boolean;
    export(): PublishTransactionLike;
}
export default PublishTransaction;
//# sourceMappingURL=PublishTransaction.d.ts.map