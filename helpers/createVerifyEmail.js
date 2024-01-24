import "dotenv/config";


const createVerifyEmail = ({ email, verificationToken }) => {
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="http://localhost:3000/api/users/verify/${verificationToken}" target="_blank">Click verify email</a>`,
  };

  return verifyEmail;
};

export default createVerifyEmail;