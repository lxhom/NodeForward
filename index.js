// noinspection JSUnfilteredForInLoop

/// SETUP

const express = require("express"); // Require express
const multer = require('multer'); // Require multer (multipart parser)

const keys = require("./keys.js"); // Load key file

let app = express(); // Init express
app.use(multer().array()); // Init multer

const sgMail = require('@sendgrid/mail'); // Init sendgrid
sgMail.setApiKey(keys.sendgridKey); // Set api key

/// MAIN HANDLERS

for (let hook of keys.hooks) {
  app.post(hook.hookUrl, async (req, res) => { // main route
    try { // try/catch just in case

      /// REQUEST HANDLING

      console.log("Received:", req.body) // Log received mail
      // noinspection JSUnresolvedVariable
      let envelope = JSON.parse(req.body.envelope); // Load envelope from webhook
      let origText = `\n\n\nThis is an automated reply to this email from <${envelope.from}>:\n\n` +
          req.body.text.split("\n").map(x => "> " + x).join("\n"); // reply text for responses

      /// HELPER FUNCTIONS

      let logSend = async obj => { // Send logger function
        console.log("Sending...", obj); // Log the sent mail and
        return await sgMail.send(obj); // actually send it
      };
      let reply = async obj => await logSend({ // Easier automated reply function
        to: envelope.from,
        replyTo: envelope.from,
        from: hook.proxy,
        ...obj
      });

      /// VALIDATION CHECKS

      if (envelope.to.includes(hook.proxy)) { // If sent to the receiver address: (Outgoing email)
        if (envelope.from in await hook.allowedUsers) { // If sender is whitelisted:
          let splitSubject = req.body.subject.split(" % "); // Parse subject code
          if (splitSubject.length === 2 && splitSubject[0].split(" > ").length === 2) { // If subject code is correct:
            let [addresses, subject] = splitSubject; // Split subject into addresses and the subject itself
            let [sender, receiver] = addresses.split(" > "); // Split the addresses into sender and receiver
            if (sender.startsWith("Re: ")) { // If its a reply:
              sender = sender.replace("Re: ", ""); // Remove the reply from the sender
              subject = "Re: " + subject; // and add it to the subject
            }
            if ((await hook.allowedUsers)[envelope.from].includes(sender)) { // If the sender is allowed to send
              // from this address:

              /// EMAIL FORWARDING

              await logSend({ // Send the email
                to: receiver,
                from: sender,
                subject: subject,
                text: req.body.text,
                html: req.body.html
              });

              /// ERROR HANDLING

            } else { // If the sender is not allowed to send from this address:
              await reply({
                subject: "You are not allowed to send from this email address!",
                text: "You are whitelisted but you do not have access to that email." + origText
              });
            }
          } else { // If subject code is not correct:
            await reply({
              subject: "Invalid subject code!",
              text: "You need to delimit your sender in the URL like this: 'sender@your.domain > reciever@gmail.com %" +
                  " Subject here'." + origText
            });
          }
        } else { // If sender is not whitelisted:
          await reply({
            subject: "You are not whitelisted!",
            text: "You are not in the whitelist. Please ask me for access first." + origText
          });
        }

        /// EMAIL RECEIVING

      } else { // If not sent to the receiver address: (Incoming email)
        console.log()
        for (let receiver in await hook.allowedUsers) { // For each person who can receive emails:
          for (let allowedAddress of (await hook.allowedUsers)[receiver]) { // For every allowed email for that person:
            if (envelope.to.includes(allowedAddress)) { // If the received email is in the allowed emails:
              await logSend({ // Send the email to the persons personal email address
                from: hook.proxy,
                to: receiver,
                subject: allowedAddress + " > " + envelope.from + " % " + req.body.subject,
                text: req.body.text,
                html: req.body.html
              });
            }
          }
        }
      }

      /// REQUEST FINISHING & ERROR LOGGING

    } catch (e) {
      console.log(e); // Error logging
    }
    res.send("OK"); // Respond to the webhook
  });
}

module.exports = app; // Export the express app