import {
  bool,
  time,
  varchar, migrate, sqlite, source
} from '@jsway/jdb';

import path from 'path';

const adapters: any = { sqlite };

const schema = {
  users: {
    id: varchar(100).pk,
    active: bool().default(true),

    name: varchar(100),
    email: varchar(150),
    phone: varchar(11).optional,

    encryptedPassword: varchar(200),

    resetToken: varchar(200).optional,
    resetExpires: time().optional,

    refreshToken: varchar(200).optional,
    refreshExpires: time().optional,

    confirmToken: varchar(200).optional
  }
}


export function createStore(db: string) {
  const [adapterType, conn] = db.split('://');

  //const adapter = mysql(conn);
  const adapter = adapters[adapterType](conn);
  const store = source(adapter, schema);

  const {
    users,
  } = store.datasets;

  const runMigrations = () =>
    migrate(store, path.resolve(__dirname, '../migrations'));

  return {
    ...store,
    migrate: runMigrations,
    users
  }
}

async function testStore() {
//  const store = createStore('mysql://snooty@localhost/test');
  const store = createStore('sqlite://test.db');

  await store.migrate();

  const { users } = store.datasets; // or just get it from store directly


  await users.insert({ id: 'mike', name: 'mike', email: 'mike@me.com', encryptedPassword: 'test' });

  const mike = users({ id: 'mike' });

  console.log(await mike.get());

  await mike.set({ email: 'mike@me.com'});

  await users.delete();
}

testStore().catch(console.log);
