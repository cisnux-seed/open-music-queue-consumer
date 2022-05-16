const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const { OAuth2 } = google.auth;

class MailSender {
  #transport;

  #oauth2;

  constructor() {
    this.#oauth2 = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.RIDERECT_URI,
    );

    this.#getNewAccessToken();

    this.#transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_ADDRESS,
        accessToken: this.#oauth2.getAccessToken(),
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  sendEmail(targetEmail, content) {
    const message = {
      from: 'fajrarisqulla@gmail.com',
      to: targetEmail,
      subject: 'Export Playlist',
      text: 'Your playlist has been exported, 😎😎😎😎😎😎😎',
      attachments: [
        {
          filename: 'playlists.json',
          content,
        },
      ],
    };

    return this.#transport.sendMail(message);
  }

  #getNewAccessToken() {
    try {
      this.#oauth2.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
      });
    } catch (err) {
      console.error(err.stack);
      console.error(err.message);
    }
  }
}

module.exports = MailSender;
