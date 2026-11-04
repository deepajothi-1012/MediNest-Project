function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[character]));
}

function getPasswordResetTemplate({ otp, name }) {
  const displayName = name ? String(name) : 'there';
  const escapedName = escapeHtml(displayName);
  const escapedOtp = escapeHtml(otp);
  const subject = 'Your MediNest password reset code';
  const text = `Welcome to MediNest, ${displayName}!

We received a request to reset your password. Enter the verification code below in MediNest:

${otp}

This code expires in 10 minutes and can only be used once. If you did not request a password reset, you can ignore this email.

MediNest Medicine & Health`;

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:24px 12px;background-color:#f5f7f7;font-family:Arial,Helvetica,sans-serif;color:#243b35;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;border-collapse:collapse;background-color:#ffffff;">
            <tr>
              <td align="center" style="padding:24px 28px;border:1px solid #e6ecea;">
                <div style="font-size:25px;line-height:32px;font-weight:700;color:#176f63;">
                  <span style="display:inline-block;margin-right:8px;color:#ffffff;background-color:#176f63;border-radius:8px;padding:2px 9px;">+</span>MediNest
                </div>
                <div style="padding-top:4px;font-size:10px;letter-spacing:1.5px;color:#71827c;">MEDICINE &amp; HEALTH</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 28px 12px;font-size:14px;line-height:1.7;color:#52635d;">
                <p style="margin:0 0 18px;font-size:16px;color:#243b35;">Welcome to MediNest, ${escapedName}</p>
                <p style="margin:0 0 18px;">We received a request to reset your password. Enter the verification code below in MediNest to continue.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:8px 28px 28px;">
                <div style="border:2px dashed #287ca2;padding:12px 16px;color:#176f9d;font-size:24px;font-weight:700;letter-spacing:10px;text-align:center;">${escapedOtp}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 30px;font-size:13px;line-height:1.7;color:#687872;">
                <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#243b35;">Password reset details</p>
                <p style="margin:0 0 8px;">Code validity&nbsp;&nbsp;&nbsp;: &nbsp;10 minutes</p>
                <p style="margin:0 0 8px;">Use the code only once. If you did not request a password reset, ignore this email; your password will remain unchanged.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;border-top:1px solid #e6ecea;font-size:12px;line-height:1.6;color:#84918c;">
                This is an automated message from MediNest. Please do not reply to this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
}

module.exports = {
  getPasswordResetTemplate,
};
