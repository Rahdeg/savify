const bcrypt = require("bcryptjs");
const db = require("../services/db");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const mailjs = require("mailjs");

class Auth {
  email;

  constructor(email) {
    this.email = typeof email === "string" ? email.trim().toLowerCase() : "";
  }

  async login(password) {
    if (!this.email || !password) {
      return { ok: false, reason: "invalid_credentials" };
    }

    const sql = `
			SELECT user_id, full_name, email, password_hash, role, is_verified
			FROM users
			WHERE email = ?
			LIMIT 1
		`;
    const results = await db.query(sql, [this.email]);
    const user = results[0];

    if (!user) return { ok: false, reason: "invalid_credentials" };

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) return { ok: false, reason: "invalid_credentials" };

    if (!user.is_verified) {
      return {
        ok: false,
        reason: "email_not_verified",
        user: {
          user_id: user.user_id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
        },
      };
    }

    return {
      ok: true,
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
    };
  }

  static getMailTransport() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      throw new Error(
        "SMTP settings are missing. Please set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS.",
      );
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  static generateOtp() {
    return String(crypto.randomInt(1000, 10000));
  }

  static async sendOtpEmail(email, otp) {
    const transport = Auth.getMailTransport();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    mailjs.config({ transport });

    const textBody = `Savify Email Verification\n\nYour one-time verification code is ${otp}.\nThis code expires in 10 minutes.`;
    const htmlBody = `<div style="font-family:Arial,sans-serif;padding:20px;line-height:1.5;"><h2 style="margin:0 0 12px;">Savify Email Verification</h2><p style="margin:0 0 8px;">Your one-time verification code is <strong>${otp}</strong>.</p><p style="margin:0;color:#475569;">This code expires in 10 minutes.</p></div>`;

    const html = mailjs.render({ html: true, src: htmlBody });
    const text = mailjs.render({ src: textBody });

    await transport.sendMail({
      from,
      to: email,
      subject: "Savify OTP Verification",
      html,
      text,
    });
  }

  static async createEmailVerification(userId, email) {
    const otp = Auth.generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const invalidateSql = `
      UPDATE email_verifications
      SET is_used = 1
      WHERE user_id = ? AND verified_at IS NULL AND is_used = 0
    `;
    await db.query(invalidateSql, [userId]);

    const insertSql = `
      INSERT INTO email_verifications (user_id, email, otp_hash, expires_at)
      VALUES (?, ?, ?, ?)
    `;
    await db.query(insertSql, [userId, email, otpHash, expiresAt]);

    await Auth.sendOtpEmail(email, otp);
  }

  static async resendOtp(email) {
    const sql = `
      SELECT user_id, email, is_verified
      FROM users
      WHERE email = ?
      LIMIT 1
    `;
    const users = await db.query(sql, [email]);
    const user = users[0];

    if (!user) return { ok: false, reason: "user_not_found" };
    if (user.is_verified) return { ok: false, reason: "already_verified" };

    await Auth.createEmailVerification(user.user_id, user.email);
    return { ok: true };
  }

  static async verifyOtp(email, otp) {
    const userSql = `
      SELECT user_id, email, is_verified
      FROM users
      WHERE email = ?
      LIMIT 1
    `;
    const users = await db.query(userSql, [email]);
    const user = users[0];

    if (!user) return { ok: false, reason: "user_not_found" };
    if (user.is_verified) return { ok: true, reason: "already_verified" };

    const verificationSql = `
      SELECT verification_id, otp_hash, expires_at, attempts
      FROM email_verifications
      WHERE user_id = ? AND verified_at IS NULL AND is_used = 0
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const rows = await db.query(verificationSql, [user.user_id]);
    const record = rows[0];

    if (!record) return { ok: false, reason: "otp_not_found" };

    if (new Date(record.expires_at).getTime() < Date.now()) {
      await db.query(
        "UPDATE email_verifications SET is_used = 1 WHERE verification_id = ?",
        [record.verification_id],
      );
      return { ok: false, reason: "otp_expired" };
    }

    const isValidOtp = await bcrypt.compare(otp, record.otp_hash);
    if (!isValidOtp) {
      await db.query(
        "UPDATE email_verifications SET attempts = attempts + 1 WHERE verification_id = ?",
        [record.verification_id],
      );
      return { ok: false, reason: "invalid_otp" };
    }

    await db.query(
      "UPDATE email_verifications SET verified_at = NOW(), is_used = 1 WHERE verification_id = ?",
      [record.verification_id],
    );
    await db.query("UPDATE users SET is_verified = 1 WHERE user_id = ?", [
      user.user_id,
    ]);

    return { ok: true, reason: "verified" };
  }

  static logout(session) {
    return new Promise((resolve, reject) => {
      if (!session) return resolve();

      session.destroy((err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }
}

module.exports = {
  Auth,
};
