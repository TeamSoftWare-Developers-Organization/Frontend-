import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { bearer } from "better-auth/plugins";
import nodemailer from "nodemailer";

// إعداد متصل البريد الإلكتروني (SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/auth_db";
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET || "default_super_secret_better_auth_key_123456789";
const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const dbPool = new Pool({
  connectionString: DATABASE_URL,
});

export const auth = betterAuth({
  database: dbPool,
  secret: BETTER_AUTH_SECRET,
  baseURL: BETTER_AUTH_URL,
  
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    maxPasswordLength: 100,

    // 📨 إرسال إيميل إعادة تعيين كلمة المرور
    sendResetPassword: async ({ user, url }) => {
      try {
        await transporter.sendMail({
          from: '"MicroShop Support" <support@microshop.ly>',
          to: user.email,
          subject: "إعادة تعيين كلمة المرور - MicroShop",
          html: `
            <div dir="rtl" style="font-family: Arial; padding: 20px;">
              <h2>مرحباً ${user.name}،</h2>
              <p>لقد طلبت إعادة تعيين كلمة مرورك. انقر على الزر أدناه للمتابعة:</p>
              <a href="${url}" style="background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">تغيير كلمة المرور</a>
            </div>
          `,
        });
        console.log(`✅ تم إرسال إيميل إعادة تعيين كلمة المرور إلى: ${user.email}`);
      } catch (err: any) {
        console.error("❌ فشل إرسال إيميل إعادة تعيين كلمة المرور:", err.message);
      }
    },
  },

  // 📨 إرسال إيميل التحقق من الحساب
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await transporter.sendMail({
          from: '"MicroShop Accounts" <welcome@microshop.ly>',
          to: user.email,
          subject: "تفعيل حسابك في MicroShop",
          html: `
            <div dir="rtl" style="font-family: Arial; padding: 20px;">
              <h2>أهلاً بك يا ${user.name}! 🎉</h2>
              <p>شكراً لانضمامك إلينا. يرجى تفعيل حسابك عبر النقر على الرابط التالي:</p>
              <a href="${url}" style="background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">تفعيل الحساب</a>
            </div>
          `,
        });
        console.log(`✅ تم إرسال إيميل التفعيل إلى: ${user.email}`);
      } catch (err: any) {
        console.error("❌ فشل إرسال إيميل التفعيل:", err.message);
      }
    },
  },

  rateLimit: { window: 60, max: 15 },

  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:8085",
    "https://*.pages.dev",
    "https://*.workers.dev",
    "https://*.microshop.ly",
    "https://microshop.ly",
  ],

  plugins: [
    bearer(),
  ],
});
