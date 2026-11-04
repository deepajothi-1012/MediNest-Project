function getPasswordResetTemplate({ otp }) {
  const subject = 'Your MediNest password reset code';
  const text = `Your MediNest password reset code is ${otp}. It expires in 10 minutes. If you did not request this, you can ignore this email.`;

  return { subject, text };
}

module.exports = {
  getPasswordResetTemplate,
};
