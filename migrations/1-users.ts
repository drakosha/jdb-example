import {
  int,
  bool,
  time,
  varchar,
  Connection
} from '@jsway/jdb';


export default async function createUsers(tx: Connection) {
  await tx.createTable('users', {
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
  });
};
