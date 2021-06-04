// Fill out the data and rename this to keys.js!

// noinspection SpellCheckingInspection

module.exports = {
  sendgridKey: 'SG.aaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', // Your Sendgrid api key
  hooks: [
    {
      hookUrl: "/hook//aaaaaa", // Hook path. This is handled by Express, so wildcards are allowed (see express docs)
      proxy: "outbox@your.domain", // Proxy email adress, this will be used to communicate with your server
      get allowedUsers() { return new Promise(resolve => resolve({ // Allowed users list w/ 2 methods:
        "personal_inbox@gmail.com": ["alias@your.domain", "alias2@your.domain"],
        "another_personal_inbox@gmail.com": ["alias3@your.domain", "alias4@your.domain"],
      })) } // Method 1, getter which can return a promise OR
    },
    {
      hookUrl: "/bbbbbb",
      proxy: "outbox@other.domain",
      allowedUsers: {
        "personal_inbox@gmail.com": ["alias@other.domain", "alias2@other.domain"],
        "another_personal_inbox@gmail.com": ["alias3@other.domain", "alias4@other.domain"],
      } // Method 2, regular object
    }
  ]
};