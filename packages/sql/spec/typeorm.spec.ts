import { FieldCondition } from '@ucast/core'
import {
  EntitySchema,
  DataSource,
  SelectQueryBuilder
} from 'typeorm'
import { interpret } from '../src/lib/typeorm'
import { expect } from './specHelper'

type Depromisify<T extends Promise<any>> = T extends Promise<infer A> ? A : never
type OrmContext = Depromisify<ReturnType<typeof configureORM>>

describe('Condition interpreter for TypeORM', () => {
  let dataSource: OrmContext['dataSource']
  let User: OrmContext['User']

  before(async () => {
    const ctx = await configureORM()
    dataSource = ctx.dataSource
    User = ctx.User
  })

  after(async () => {
    await dataSource.destroy()
  })

  it('returns a `SelectQueryBuilder<T>`', () => {
    const condition = new FieldCondition('eq', 'name', 'test')
    const query = interpret(condition, dataSource.createQueryBuilder(User, 'u'))

    expect(query).to.be.instanceof(SelectQueryBuilder)
    expect(query.getQuery()).to.equal([
      'SELECT "u"."id" AS "u_id", "u"."name" AS "u_name"',
      'FROM "user" "u"',
      'WHERE "u"."name" = :0'
    ].join(' '))
    expect(query.getParameters()).to.eql({ 0: 'test' })
  })

  it('properly binds parameters for "IN" operator', () => {
    const condition = new FieldCondition('in', 'age', [1, 2, 3])
    const query = interpret(condition, dataSource.createQueryBuilder(User, 'u'))

    expect(query.getQuery()).to.equal([
      'SELECT "u"."id" AS "u_id", "u"."name" AS "u_name"',
      'FROM "user" "u"',
      'WHERE "u"."age" in(:0, :1, :2)'
    ].join(' '))

    expect(query.getParameters()).to.eql({
      0: 1,
      1: 2,
      2: 3
    })
  })

  it('automatically inner joins relation when condition is set on relation field', () => {
    const condition = new FieldCondition('eq', 'projects.name', 'test')
    const query = interpret(condition, dataSource.createQueryBuilder(User, 'u'))

    expect(query.getQuery()).to.equal([
      'SELECT "u"."id" AS "u_id", "u"."name" AS "u_name"',
      'FROM "user" "u"',
      'INNER JOIN "project" "projects" ON "projects"."userId"="u"."id"',
      'WHERE "projects"."name" = :0'
    ].join(' '))
    expect(query.getParameters()).to.eql({ 0: 'test' })
  })
})

async function configureORM() {
  class User {
    id!: number
    name!: string
    projects!: Project[]
  }

  class Project {
    id!: number
    name!: string
    user!: User
  }

  const UserSchema = new EntitySchema<User>({
    name: 'User',
    target: User,
    columns: {
      id: { primary: true, type: 'int', generated: true },
      name: { type: 'varchar' },
    },
    relations: {
      projects: {
        target: 'Project',
        type: 'one-to-many',
        inverseSide: 'user'
      }
    }
  })

  const ProjectSchema = new EntitySchema<Project>({
    name: 'Project',
    target: Project,
    columns: {
      id: { primary: true, type: 'int', generated: true },
      name: { type: 'varchar' },
    },
    relations: {
      user: { target: 'User', type: 'many-to-one' }
    }
  })

  const dataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    entities: [UserSchema, ProjectSchema],
    synchronize: true
  })

  await dataSource.initialize()

  return { User, Project, dataSource }
}
