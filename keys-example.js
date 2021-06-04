// noinspection SpellCheckingInspection,JSUnresolvedVariable

//// EXAMPLE CONFIGURATION WITH DETA BASE ////

const {Deta} = require('deta'); // import Deta

const deta = Deta(/* your key or nothing if youre deploying on deta */);

const db = deta.Base('mail-domains');

let domainFetcher = async domain => {
  let data = (await db.fetch({"alias?contains": "@" + domain}).next()).value;
  if (data === null) return {};
  let allowedUsers = {}
  for (let user of data) {
    if (allowedUsers[user.owner] === undefined) allowedUsers[user.owner] = [];
    allowedUsers[user.owner].push(user.alias)
  }
  return allowedUsers;
}

module.exports = {
  sendgridKey: 'SG.aaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  hooks: [
    {
      hookUrl: "/hook/incoming/aaaaaa",
      proxy: "outbox@your.domain",
      get allowedUsers() { return domainFetcher("your.domain") }
    },
    {
      hookUrl: "/hook/incoming/bbbbbb",
      proxy: "outbox@other.domain",
      get allowedUsers() { return domainFetcher("other.domain") }
    }
  ]
};