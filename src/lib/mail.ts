import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "mail@cpocs.io",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "mail@cpocs.io",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  
  const sender = {
    to: email,
    from: process.env.USER_EMAIL,
    html: `<p>Digest 이메일 인증</p>
    <p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    subject: "Digest 이메일 인증",
  };

  console.log("신청:",sender)

  const response = await fetch(`${domain}/api/register`, {
      method: "POST",
      body: JSON.stringify(sender),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
}