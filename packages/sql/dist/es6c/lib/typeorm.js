'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index = require('../index');

function joinRelation(relationName, query) {
  const meta = query.expressionMap.mainAlias.metadata;
  const relation = meta.findRelationWithPropertyPath(relationName);

  if (relation) {
    query.innerJoin(`${query.alias}.${relationName}`, relationName);
    return true;
  }

  return false;
}

const typeormPlaceholder = index => `:${index - 1}`;

const dialects = index.createDialects({
  joinRelation,
  paramPlaceholder: typeormPlaceholder
});
dialects.sqlite.escapeField = dialects.sqlite3.escapeField = dialects.pg.escapeField;
function createInterpreter(interpreters) {
  const interpretSQL = index.createSqlInterpreter(interpreters);
  return (condition, query) => {
    const connection = query.connection;
    const dialect = connection.options.type;
    const options = Object.assign({}, dialects[dialect], {
      rootAlias: query.alias
    });

    if (!options) {
      throw new Error(`Unsupported database dialect: ${dialect}`);
    }

    const [sql, params] = interpretSQL(condition, options, query);
    return query.where(sql, params);
  };
}
const interpret = createInterpreter(index.allInterpreters);

exports.createInterpreter = createInterpreter;
exports.interpret = interpret;
//# sourceMappingURL=typeorm.js.map
