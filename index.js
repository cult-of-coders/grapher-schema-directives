import directiveDefinitions from './directiveDefinitions';
import LinkDirective from './LinkDirective';
import MapToDirective from './MapToDirective';
import MongoDirective from './MongoDirective';

const directives = {
  mongo: MongoDirective,
  link: LinkDirective,
  map: MapToDirective,
};

export {
  directives,
  directiveDefinitions,
  LinkDirective,
  MapToDirective,
  MongoDirective,
};
