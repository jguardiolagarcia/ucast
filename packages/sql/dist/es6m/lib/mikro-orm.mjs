import { createDialects, mysql, createSqlInterpreter, allInterpreters } from '../index';

function joinRelation(relationName, query) {
  const privateQuery = query;
  const meta = privateQuery.metadata.get(privateQuery.entityName);
  const prop = meta.properties[relationName];

  if (prop && prop.reference) {
    query.join(`${query.alias}.${relationName}`, relationName);
    return true;
  }

  return false;
}

const dialects = createDialects({
  joinRelation,
  paramPlaceholder: mysql.paramPlaceholder
});
function createInterpreter(interpreters) {
  const interpretSQL = createSqlInterpreter(interpreters);
  return (condition, query) => {
    const dialect = query.driver.config.get('type');
    const options = dialects[dialect];

    if (!options) {
      throw new Error(`Unsupported database dialect: ${dialect}`);
    }

    const [sql, params] = interpretSQL(condition, options, query);
    return query.where(sql, params);
  };
}
const interpret = createInterpreter(allInterpreters);

export { createInterpreter, interpret };
//# sourceMappingURL=mikro-orm.mjs.map
