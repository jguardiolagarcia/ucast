declare function posixRegex(field: string, placeholder: string, ignoreCase: boolean): string;
declare function regexp(field: string, placeholder: string): string;
export declare const oracle: {
    regexp: typeof posixRegex;
    paramPlaceholder: (index: number) => string;
    escapeField: (field: string) => string;
};
export declare const pg: {
    regexp: typeof posixRegex;
    paramPlaceholder: (index: number) => string;
    escapeField: (field: string) => string;
};
export declare const mysql: {
    regexp: typeof regexp;
    paramPlaceholder: () => string;
    escapeField: (field: string) => string;
};
export declare const sqlite: {
    regexp: typeof regexp;
    paramPlaceholder: () => string;
    escapeField: (field: string) => string;
};
export declare const mssql: {
    regexp(): never;
    paramPlaceholder: () => string;
    escapeField: (field: string) => string;
};
export interface DialectOptions {
    regexp(field: string, placeholder: string, ignoreCase: boolean): string;
    joinRelation?(relationName: string, context: unknown): boolean;
    escapeField(field: string): string;
    paramPlaceholder(index: number): string;
}
export type SupportedDialects = 'mssql' | 'postgres' | 'pg' | 'oracle' | 'oracledb' | 'mysql' | 'mysql2' | 'mariadb' | 'sqlite3' | 'sqlite';
type Dialects<V> = Record<SupportedDialects, DialectOptions & V>;
export declare function createDialects<T extends Partial<DialectOptions>>(options: T): Dialects<T>;
export {};
