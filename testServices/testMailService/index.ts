import express, { Express, Request, Response } from 'express';
const app: Express = express();
const nodemailer = require("nodemailer");

const port = process.env.PORT 

// Create a transporter using your SMTP settings
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });


app.get('/', (req: Request, res: Response) => {
    res.send('Notification Service | API page on development ...');
});

app.get('/send-email', async (req, res) => {
  
    const mailOptions = {
        to: "daniel.silva.prg@gmail.com", 
        subject: "Teste", 
        html: "<p>Teste de teste!</p>",
        from: 'supp.evalcue@gmail.com'
    };

    try{
        transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
              console.error(error);
              res.status(500).send('Error sending email');
            } else {
              console.log('Email sent: ' + info.response);
              res.send('Email sent successfully');
            }
          });
    }catch{}
  
  });

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
