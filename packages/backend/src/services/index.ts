import { Application } from '../declarations';
import users from './users/users.service';
import nfcReaders from './nfc-readers/nfc-readers.service';
import nfcTags from './nfc-tags/nfc-tags.service';

export default (app: Application): void => {
  app.configure(users);
  app.configure(nfcReaders);
  app.configure(nfcTags);
};
