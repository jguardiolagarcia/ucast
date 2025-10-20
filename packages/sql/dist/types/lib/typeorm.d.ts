import { Condition } from '@ucast/core';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { SqlOperator } from '../index';
export declare function createInterpreter(interpreters: Record<string, SqlOperator<any>>): <Entity extends ObjectLiteral>(condition: Condition, query: SelectQueryBuilder<Entity>) => SelectQueryBuilder<Entity>;
export declare const interpret: <Entity extends ObjectLiteral>(condition: Condition, query: SelectQueryBuilder<Entity>) => SelectQueryBuilder<Entity>;
