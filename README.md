# NodeForward
NodeForward is a Node.js tool to use an inbox on your domain right from your normal inbox. Made with Sendgrid and deployed on Deta.sh.

## Installation
First you need access to your Domain, and you need to change DNS records, because we need to set up Sendgrid. [*](#-i-am-pretty-much-insane-but-not-insane-enough-to-write-my-own-email-server-in-nodejs)

You should have the repo on your PC now, because we need to edit a few things.

You have to [create an account](https://signup.sendgrid.com/) on Sendgrid now. If you have done that, [verify your domain](https://sendgrid.com/docs/ui/account-and-settings/how-to-set-up-domain-authentication/), and then [create a new API Key](https://sendgrid.com/docs/ui/account-and-settings/api-keys/#creating-an-api-key) and copy it into the [keys.template.js](/keys.template.js) file (`keys.sendgridKey`).

For each domain you can use your own settings. You have to create an object in the `keys.hooks` array in the [keys.template.js](/keys.template.js) file.

Now, insert your outbox mail address (which is essentially a proxy) into the hook in [keys.template.js](/keys.template.js) file (`keys.hooks[].proxy`).

You can now set your user permissions up in the [keys.template.js](/keys.template.js) file (`keys.hooks[].allowedUsers`), see the example.

> Tip: The keys.template.js file is a regular CommonJS module, so you can add your own code to query user credentials (or to query anything else). I recommend setting a getter property so that you don't have to restart the server on changes. I've also made [an example](/keys-example.js) for this.

Now enter a URL path into the `keys.hooks[].hookURL` property of the [keys.template.js](/keys.template.js) file (you'll need that in a second).

> Tip: Express handles this name, so you can use wildcards. See the [express docs](https://expressjs.com/en/guide/routing.html). I do this internally:
> 
> ```js
> app.post(hook.hookUrl, async (req, res) => { // main route
> ```

We need to set up an email receive webhook on Sendgrid now. To do that, you have to find your public endpoint's name. If you plan to deploy this on [Deta](https://deta.sh), deploy the server as it is, and you'll get a URL. Now you have to add `https://yourserver.domain/[keys.hooks[].hookURL]` to your URL and you have the webhook URL. Now follow [this guide](https://sendgrid.com/docs/for-developers/parsing-email/setting-up-the-inbound-parse-webhook/) to make the webhook receive your emails.

Now rename `keys.template.js` to `keys.js` and you're good to go :D

## Usage

To send emails, email the address in `keys.reciever` and use this code in the subject line: `[sender-name@your.domain] > [actual-reciever] % [your subject]`.

Receiving emails is done automatically, and you can reply to them, and it'll show up as a response in your recipient's mailbox.

## To-Do

- [x] Multi-Domain support
- [x] Addresses/Aliases changes without restart
- [x] Replies/Conversations working properly for the recipient
- [ ] Replies/Conversations working properly for the user
- [ ] Attachment support
- [ ] Metadata support

## Contributing

Just open an issue or send me a Pull Request! :D

------
###### * I am pretty much insane, but not insane enough to write my own email server in Node.js.
