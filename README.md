# NodeForward
NodeForward is a Node.js tool to use an inbox on your domain right from your normal inbox. Made with Sendgrid and deployed on Deta.sh.

## Installation
First of all, you need access to your Domain and you need to change DNS records, because we need to set up Sendgrid. [*](#-i-am-pretty-much-insane-but-not-insane-enough-to-write-my-own-email-server-in-nodejs)

You should have the repo on your PC now, because we need to edit a few things.

You have to [create an account](https://signup.sendgrid.com/) on Sendgrid now. If you have done that, [verify your domain](https://sendgrid.com/docs/ui/account-and-settings/how-to-set-up-domain-authentication/), and then [create a new API Key](https://sendgrid.com/docs/ui/account-and-settings/api-keys/#creating-an-api-key) and copy it into the [keys.template.js](/keys.template.js) file (`keys.sendgrid`).

Now, insert your outbox mail address (which is essentially a proxy) into the [keys.template.js](/keys.template.js) file (`keys.reciever`).

You can now set your user permissions up in the [keys.template.js](/keys.template.js) file (`keys.allowedUsers`), see the example.

> Tip: The keys.template.js file is a regular CommonJS module, so you can add your own code to query user credentials (or to query anything else). I reccomend setting a getter property so that you dont have to restart the server on changes.

Now enter a random string (thats URL-compatible) into the `keys.webhookSecret` property of the [keys.template.js](/keys.template.js) file (you'll need that in a second).

We need to set up a email recieve webhook on Sendgrid now. To do that, you have to find your public endpoint's name. If you plan to deploy this on [Deta](https://deta.sh), deploy the server as it is, and you'll get an URL. Now you have to add `/webhook/incoming/[the string in keys.webhookSecret]` to your URL and you have the webhook URL. Now follow [this guide](https://sendgrid.com/docs/for-developers/parsing-email/setting-up-the-inbound-parse-webhook/) to make the webhook recieve your emails.

Now rename `keys.template.js` to `keys.js` and youre good to go :D

## Usage

To send emails, send an email to the address in `keys.reciever` and use this code in the subject line: `[sender-name@your.domain] > [actual-reciever] % [your subject]`.

Recieving emails is done automatically, and you can reply to them and it'll show up as a response in your recipient's mailbox.

------
###### * I am pretty much insane, but not insane enough to write my own email server in Node.js.
