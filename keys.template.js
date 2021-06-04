// Fill out the data and rename this to keys.js!

// noinspection SpellCheckingInspection

module.exports = {
  sendgrid: 'Your sendgrid API key',
  reciever: 'outbox-name@your.domain',
  allowedUsers: {
    "personal_inbox@gmail.com": ["alias@your.domain", "alias2@your.domain"],
    "another_personal_inbox@gmail.com": ["alias3@your.domain", "alias4@your.domain"],
  },
  webhookSecret: "this gets added to the end of the webhook URL, so you need a webhook like this:" +
      " https://abcdef.deta.dev/webhook/incoming/[content of this string]"
}