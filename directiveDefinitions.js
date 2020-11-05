export default `
  directive @mongo(
    name: String!
  ) on OBJECT | INTERFACE | FIELD_DEFINITION

  directive @link(
    field: String
    to: String
    metadata: Boolean
    unique: Boolean
    autoremove: Boolean
  ) on FIELD_DEFINITION

  directive @map(
    to: String
  ) on FIELD_DEFINITION
`;
