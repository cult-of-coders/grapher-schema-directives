import { SchemaDirectiveVisitor } from 'graphql-tools';
import { Mongo } from 'meteor/mongo';

export default class MongoDirective extends SchemaDirectiveVisitor {
  /**
   * @param {GraphQLObjectType} type
   */
  visitObject(type) {
    if (type._mongoCollectionName) {
      // it has already been setup by a link directive somewhere
      return;
    }

    setupMongoDirective(type, this.args);
  }

  visitFieldDefinition() {}
}

export function setupMongoDirective(type, args) {
  const { name } = args;

  type._mongoCollectionName = name;

  let collection = Mongo.Collection.get(name);
  if (!collection) {
    collection = new Mongo.Collection(name);
  }
}
