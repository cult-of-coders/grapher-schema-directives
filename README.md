# Grapher and GraphQL Schema Directives

Wouldn't it be sweet if we could setup our collections and links in our GraphQL type definitions?

Yes, it would be very sweet.

## Install

```
meteor add cultofcoders:grapher-schema-directives
```

## Sample

Where you define your types:

```js
type User @mongo(name: "users") {
    comments: [Comment] @link(to: "user")
}

type Comment @mongo(name: "comments") {
   user: User @link(field: "userId")
   post: Post @link(field: "commentId")
   createdAt: Date @map("created_at")
}

type Post @mongo(name: "posts") {
    comments: [Comment] @link(to="post")
}
```

In the background, the schema directives analyze our types and create propper links, when we have a `field` present, that's going to be a main link, that's the collection we are going to store it in, when we have `to` present, that's going to be an inversed link.

Direct fields are automatically indexed by default. You don't have to specify `index: true`

Options to direct links:

```js
@map(field: "linkStorageField", autoremove: true, unique: true, metadata: true)
```

For more information about options, refer to [Grapher API](https://github.com/cult-of-coders/grapher/blob/master/docs/api.md#adding-links)

Each `ObjectType` needs to have the propper `@mongo` directive to work.

The `@map` directive makes a database field be aliased. The reason for this is that when we query with Grapher's GraphQL abilities to properly adapt that field to the correspondant db field. In the backscene, we basically have a `reducer`.

## Usage

```js
import {
  directives, // the full map of the directive, as mentioned in the sample above
  directiveDefinitions, // the definitions
  MapToDirective, // the actual directive classes
  LinkDirective,
  MongoDirective,
} from 'meteor/cultofcoders:grapher-schema-directives';

// Add them to your graphql servers
```

If you are using `cultofcoders:apollo` package, this is done by default, you don't have to care about it.

This is a very quick way to setup your schema, however if you need to use denormalisation abilities, and you don't want
to give up the sugary directives above:

```js
import { db } from 'meteor/cultofcoders:grapher';

Meteor.startup(() => {
  const userCommentLinker = db.users.getLinker('comments');
  Object.assign(userCommentLinker.linkConfig, {
    denormalize: {},
  });
  userCommentLinker._initDenormalization();
});
```
