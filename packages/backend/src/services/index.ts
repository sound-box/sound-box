import { Application } from '../declarations';
import users from './users/users.service';
import nfcReaders from './nfc-readers/nfcReader.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default (app: Application): void => {
  app.configure(users);
  app.configure(nfcReaders);
};
