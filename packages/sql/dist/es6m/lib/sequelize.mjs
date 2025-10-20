import { literal, Utils } from 'sequelize';
import { createDialects, mysql, createSqlInterpreter, allInterpreters } from '../index';

const hasOwn = Object.hasOwn || Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);

function joinRelation(relationName, Model) {
  return hasOwn(Model.associations, relationName);
}

const dialects = createDialects({
  joinRelation,
  paramPlaceholder: mysql.paramPlaceholder
});
function createInterpreter(interpreters) {
  const interpretSQL = createSqlInterpreter(interpreters);
  return (condition, Model) => {
    const dialect = Model.sequelize.getDialect();
    const options = dialects[dialect];

    if (!options) {
      throw new Error(`Unsupported database dialect: ${dialect}`);
    }

    const [sql, params, joins] = interpretSQL(condition, options, Model);
    return {
      include: joins.map(association => ({
        association,
        required: true
      })),
      where: literal(Utils.format([sql, ...params], dialect))
    };
  };
}
const interpret = createInterpreter(allInterpreters);

export { createInterpreter, interpret };
//# sourceMappingURL=sequelize.mjs.map
