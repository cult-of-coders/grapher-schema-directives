## Grapher & GraphQL Schema Directives

Wouldn't it be sweet if we could setup our collections and links in our GraphQL type definitions? Yes, it would be very sweet.

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

In the background, the schema directives analyze our types and create propper links, when we have a `field` present,
that's going to be a main link, that's the collection we are going to store it in, when we have `to` present, that's going to be an inversed link.

Each `ObjectType` needs to have the propper `@mongo` directive to work.

The `@map` directive makes a database field be aliased. The reason for this is that when we query with Grapher's GraphQL abilities
to properly adapt that field to the correspondant db field. In the backscene, we basically have a `reducer`.

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

If you are using `cultofcoders:apollo` package:

```js
import { load } from 'graphql-load';
import { Config } from 'meteor/cultofcoders:apollo';
import {
  directives,
  directiveDefinitions,
} from 'meteor/cultofcoders:grapher-schema-directives';

load({ typeDefs: directiveDefinitions });

Config.GRAPHQL_SCHEMA_DIRECTIVES = {
  ...directives,
};
```

Another quick trick you could use:

```js
import { db } from 'meteor/cultofcoders:grapher';
import { Config } from 'meteor/cultofcoders:apollo';

Object.assign(Config.CONTEXT, { db });
```

Which basically allows you to do:

```js
export default {
  Query: {
    users(_, args, context, ast) {
      // Where db.`mongoCollectionName`
      return context.db.users.astToQuery(ast).fetch();
    },
  },
};
```
