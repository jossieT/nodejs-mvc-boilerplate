const transporter = require('../utils/email-transporter');
const config = require('../config/config');

const signUp = async (user) => {
  try {
    await transporter.sendMail({
      from: config.email,
      to: user.email,
      subject: 'Successfuly registered',
      text: 'Thanks for signing up',
    });
    console.log(`Registration email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  signup: signUp,
};
