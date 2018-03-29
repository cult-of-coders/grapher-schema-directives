## GraphQL - Grapher Technology

Example:

```js
type User @mongo("users") {
    comments: [Comment] @link(to: "user")
}

type Comment @mongo("comments") {
   user: User @link(field: "userId")
   createdAt: Date @map("created_at")
}
```

In the background, the schema directives analyze our types and create propper links, when we have a `field` present,
that's going to be a main link, when we have `to` present, that's going to be an inversed link.

The `@map` directive makes a database field be aliased. The reason for this is that when we query with Grapher's GraphQL abilities
to properly adapt that field to the correspondant db field.

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

For using `cultofcoders:apollo` package:

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
