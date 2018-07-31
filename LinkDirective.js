import { SchemaDirectiveVisitor } from 'graphql-tools';
import { GraphQLList, GraphQLObjectType, GraphQLNonNull } from 'graphql/type';
import { Mongo } from 'meteor/mongo';
import { setupMongoDirective } from './MongoDirective';

export default class LinkDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) {
    const { objectType } = details;
    const { args } = this;

    if (!objectType._mongoCollectionName) {
      throw new Meteor.Error(
        'collection-not-found',
        `You are trying to set the link: ${
          field.name
        } but your object type does not have @mongo directive set-up`
      );
    }

    const isArrayField = field.type instanceof GraphQLList;
    let referencedType;

    if (isArrayField) {
      referencedType = field.type.ofType;
    } else {
      referencedType = field.type;
    }

    if (referencedType instanceof GraphQLNonNull) {
      referencedType = referencedType.ofType;
    } else {
      if (!(referencedType instanceof GraphQLObjectType)) {
        throw new Meteor.Error(
          'invalid-type',
          `You are trying to attach a link on a invalid type. @link directive only works with GraphQLObjectType `
        );
      }
    }

    let referencedCollectionName = referencedType._mongoCollectionName;
    if (!referencedCollectionName) {
      const objectNodeDirectives = referencedType.astNode.directives;
      const mongoDirective = objectNodeDirectives.find(directive => {
        return directive.name.value === 'mongo';
      });

      if (mongoDirective) {
        const nameArgument = mongoDirective.arguments.find(
          argument => argument.name.value === 'name'
        );

        setupMongoDirective(referencedType, {
          name: nameArgument.value.value,
        });

        referencedCollectionName = nameArgument.value.value;
      } else {
        throw new Meteor.Error(
          'invalid-collection',
          `The referenced type does not have a collection setup using @mongo directive`
        );
      }
    }

    const thisCollectionName = objectType._mongoCollectionName;

    const referencedCollection = Mongo.Collection.get(referencedCollectionName);
    const thisCollection = Mongo.Collection.get(thisCollectionName);

    let config = {};
    if (args.to) {
      config = Object.assign({}, args);
      config.inversedBy = args.to;
      delete config.to;
    } else {
      if (args.field) {
        config = Object.assign(
          {
            type: isArrayField ? 'many' : 'one',
            field: args.field,
            index: true,
          },
          args
        );
      } else {
        throw new Meteor.Error(
          `invalid-args`,
          `You have provided invalid arguments for this link in ${thisCollectionName}. The "field" property is missing.`
        );
      }
    }

    thisCollection.addLinks({
      [field.name]: {
        collection: referencedCollection,
        ...config,
      },
    });
  }
}
