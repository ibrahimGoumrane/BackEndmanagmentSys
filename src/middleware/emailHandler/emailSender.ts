import SMTPTransport from "nodemailer/lib/smtp-transport";
import transporter from "./emailConfig";
interface MailData {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}
const emailSender = (
  mailData: MailData
): Promise<SMTPTransport.SentMessageInfo> => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        reject(err); // If there's an error, reject the promise
      } else {
        resolve(info); // If the email is sent successfully, resolve the promise
      }
    });
  });
};

export default emailSender;
