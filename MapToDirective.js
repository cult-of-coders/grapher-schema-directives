import { SchemaDirectiveVisitor } from 'graphql-tools';
import { GraphQLScalarType, GraphQLObjectType } from 'graphql/type';
import { Mongo } from 'meteor/mongo';

function resolve(path, obj) {
  return path.split('.').reduce(function(prev, curr) {
    return prev ? prev[curr] : undefined;
  }, obj || self);
}
export default class MapToDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) {
    const { objectType } = details;
    const { args } = this;

    if (!objectType._mongoCollectionName) {
      throw new Meteor.Error(
        'collection-not-found',
        `You are trying to set mapTo: ${
          field.name
        } but your object type does not have @mongo directive set-up`
      );
    }

    const isScalar = field.type instanceof GraphQLScalarType;
    if (!isScalar) {
      throw new Meteor.Error(
        'collection-not-found',
        `You are trying to set the mapTo directive on a non-scalar on field ${
          field.name
        }`
      );
    }

    const collection = Mongo.Collection.get(objectType._mongoCollectionName);

    collection.addReducers({
      [field.name]: {
        body: {
          [args.to]: 1,
        },
        reduce(obj) {
          return resolve(args.to, obj);
        },
      },
    });
  }
}
