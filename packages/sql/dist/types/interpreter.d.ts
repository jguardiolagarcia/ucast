import { Condition, InterpretationContext } from '@ucast/core';
import { DialectOptions } from './dialects';
export interface SqlQueryOptions extends Required<DialectOptions> {
    rootAlias?: string;
}
export declare class Query {
    readonly options: SqlQueryOptions;
    private _fieldPrefix;
    private _params;
    private _sql;
    private _joins;
    private _lastPlaceholderIndex;
    private _targetQuery;
    private _rootAlias;
    constructor(options: SqlQueryOptions, fieldPrefix?: string, targetQuery?: unknown);
    field(rawName: string): string;
    param(): string;
    manyParams(items: unknown[]): string[];
    child(): Query;
    where(field: string, operator: string, value?: unknown): this;
    whereRaw(sql: string, ...values: unknown[]): this;
    merge(query: Query, operator?: 'and' | 'or', isInverted?: boolean): this;
    usingFieldPrefix(prefix: string, callback: () => void): this;
    toJSON(): [string, unknown[], string[]];
}
export type SqlOperator<C extends Condition> = (condition: C, query: Query, context: InterpretationContext<SqlOperator<C>>) => Query;
export declare function createSqlInterpreter(operators: Record<string, SqlOperator<any>>): (condition: Condition, options: SqlQueryOptions, targetQuery?: unknown) => [string, unknown[], string[]];
