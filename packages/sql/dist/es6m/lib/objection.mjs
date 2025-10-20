import { createDialects, mysql, createSqlInterpreter, allInterpreters } from '../index';

function joinRelation(relationName, query) {
  if (!query.modelClass().getRelation(relationName)) {
    return false;
  }

  query.joinRelated(relationName);
  return true;
}

const dialects = createDialects({
  joinRelation,
  paramPlaceholder: mysql.paramPlaceholder
});
function createInterpreter(interpreters) {
  const interpretSQL = createSqlInterpreter(interpreters);
  return (condition, query) => {
    const dialect = query.modelClass().knex().client.config.client;
    const options = dialects[dialect];

    if (!options) {
      throw new Error('Unsupported database dialect');
    }

    const [sql, params] = interpretSQL(condition, options, query);
    return query.whereRaw(sql, params);
  };
}
const interpret = createInterpreter(allInterpreters);

export { createInterpreter, interpret };
//# sourceMappingURL=objection.mjs.map
