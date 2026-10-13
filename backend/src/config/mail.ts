import nodemailer from 'nodemailer';

const port = Number(process.env.SMTP_PORT) || 465;
const isSecure = port === 465;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port,
  secure: isSecure,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  auth: {
    user: process.env.SMTP_USER || 'sojibahmedshorif25@gmail.com',
    pass: process.env.SMTP_PASS || 'txdx mdvk exmz oboa',
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> => {
  try {
    let timeoutId: any;
    const sendPromise = transporter.sendMail({
      from: process.env.EMAIL_FROM || '"ShopX BD Enterprise" <sojibahmedshorif25@gmail.com>',
      replyTo: 'sojibahmedshorif25@gmail.com',
      to,
      subject,
      html,
    });

    const timeoutPromise = new Promise<null>((resolve) => {
      timeoutId = setTimeout(() => {
        console.warn(`⏱️ [Nodemailer] SMTP sending timed out after 10s for ${to}`);
        resolve(null);
      }, 10000);
    });

    const result = await Promise.race([sendPromise, timeoutPromise]);
    if (timeoutId) clearTimeout(timeoutId);
    if (result && 'messageId' in result) {
      console.log(`📧 [Nodemailer] Real Email delivered to ${to}: ${result.messageId}`);
      return true;
    }
    return false;
  } catch (error: any) {
    console.warn(`⚠️ [Nodemailer] Failed to deliver email to ${to}: ${error.message}`);
    return false;
  }
};

/**
 * 1. Ultra-Premium 2FA & Login OTP Email Template
 */
export const generateOTPEmailTemplate = (
  otp: string,
  name?: string,
  lang: 'en' | 'bn' = 'en'
): string => {
  const isBn = lang === 'bn';

  const badgeText = isBn ? '🔒 ২-ফ্যাক্টর সিকিউরিটি টোকেন' : '🔒 2-FACTOR ENTERPRISE SECURITY';
  const headerSubtitle = isBn
    ? 'অফিসিয়াল নিরাপদ জিমেইল একাউন্ট ভেরিফিকেশন'
    : 'Official Encrypted Account Verification';
  const greeting = isBn
    ? `আসসালামু আলাইকুম <strong>${name || 'সম্মানিত ইউজার'}</strong>,`
    : `Hello <strong>${name || 'Valued User'}</strong>,`;
  const message = isBn
    ? 'আপনার <strong>Shopx-BD-Enterprise</strong> অ্যাকাউন্টে নিরাপদ লগইন বা অথেন্টিকেশন সম্পন্ন করার জন্য নিচের ৬-সংখ্যার সিকিউরিটি ওটিপি (OTP) কোডটি ব্যবহার করুন।'
    : 'Use the following 6-digit One-Time Password (OTP) to securely complete your login or authentication on <strong>Shopx-BD-Enterprise</strong>.';
  const codeLabel = isBn ? 'আপনার ভেরিফিকেশন কোড' : 'YOUR 6-DIGIT VERIFICATION CODE';
  const expiryNote = isBn ? '⏱️ কোডটির মেয়াদ ১০ মিনিট' : '⏱️ Code expires in 10 minutes';
  const warning = isBn
    ? '⚠️ <strong>নিরাপত্তা সতর্কতা:</strong> এই ওটিপি কোডটি অত্যন্ত গোপনীয়। ShopX BD সাপোর্ট বা কোনো প্রতিনিধির সাথেও এটি কখনও শেয়ার করবেন না।'
    : '⚠️ <strong>Security Notice:</strong> Never share this OTP code with anyone, including ShopX BD staff or support.';
  const headOfficeLabel = isBn ? 'প্রধান কার্যালয়:' : 'Corporate Head Office:';
  const headOfficeAddress = isBn
    ? 'রৌমারী, কুড়িগ্রাম, রংপুর, বাংলাদেশ'
    : 'Rowmari, Kurigram, Rangpur, Bangladesh';
  const helplineLabel = isBn ? '২৪/৭ সার্বক্ষণিক হেল্পলাইন:' : '24/7 Dedicated Hotline:';
  const supportEmailLabel = isBn ? 'অফিসিয়াল ইমেইল:' : 'Official Email:';

  return `
  <!DOCTYPE html>
  <html lang="${lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopx-BD-Enterprise Security Code</title>
  </head>
  <body style="margin: 0; padding: 40px 10px; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <div style="max-width: 560px; margin: 0 auto; background: #0b1322; border-radius: 32px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.9);">
      
      <!-- Top Brand Header with Luxury Gradient -->
      <div style="background: linear-gradient(135deg, #020617 0%, #064e3b 60%, #042f2e 100%); padding: 40px 30px; text-align: center; border-bottom: 1px solid #1e293b;">
        <div style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 54px; height: 54px; border-radius: 18px; line-height: 54px; text-align: center; font-size: 24px; font-weight: 900; color: #ffffff; margin-bottom: 14px; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.45);">SX</div>
        <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
          Shop<span style="color: #34d399;">X</span> <span style="font-size: 13px; background: rgba(52, 211, 153, 0.15); color: #34d399; padding: 3px 10px; border-radius: 9999px; border: 1px solid rgba(52, 211, 153, 0.4); text-transform: uppercase; font-weight: 800; letter-spacing: 1px; vertical-align: middle;">ENTERPRISE</span>
        </h1>
        <p style="margin: 8px 0 0; color: #94a3b8; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;">${headerSubtitle}</p>
      </div>

      <!-- Main Body Container -->
      <div style="padding: 36px 30px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="display: inline-block; padding: 6px 16px; border-radius: 9999px; background: #030712; border: 1px solid #10b981; color: #34d399; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">
            ${badgeText}
          </span>
        </div>

        <p style="margin: 0 0 12px; font-size: 16px; color: #f8fafc; font-weight: 600; line-height: 1.5;">
          ${greeting}
        </p>
        <p style="margin: 0 0 28px; font-size: 13px; color: #94a3b8; line-height: 1.7;">
          ${message}
        </p>

        <!-- 6-Digit Glowing OTP Card -->
        <div style="background: #030712; border: 2px solid #10b981; border-radius: 24px; padding: 26px 16px; text-align: center; margin: 20px 0; box-shadow: 0 0 35px rgba(16, 185, 129, 0.18);">
          <span style="display: block; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #34d399; letter-spacing: 2px; margin-bottom: 12px;">${codeLabel}</span>
          <div style="display: inline-block; background: #0b1322; border: 1px solid #1e293b; padding: 10px 24px; border-radius: 16px;">
            <span style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #6ee7b7; font-family: 'Courier New', Courier, monospace; text-shadow: 0 0 20px rgba(110, 231, 183, 0.6);">${otp}</span>
          </div>
          <span style="display: block; font-size: 11px; color: #94a3b8; margin-top: 12px; font-weight: 600;">${expiryNote}</span>
        </div>

        <!-- Security Warning Box -->
        <div style="background: rgba(239, 68, 68, 0.08); border-left: 4px solid #ef4444; padding: 14px 18px; border-radius: 12px; margin: 24px 0 28px;">
          <p style="margin: 0; font-size: 12px; color: #fca5a5; line-height: 1.6;">
            ${warning}
          </p>
        </div>

        <!-- Corporate Support Card -->
        <div style="background: #030712; border: 1px solid #1e293b; border-radius: 20px; padding: 18px 20px; font-size: 12px; color: #cbd5e1; line-height: 1.9;">
          <p style="margin: 0 0 6px; font-weight: 800; color: #f8fafc; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
            🏢 ${headOfficeLabel}
          </p>
          <p style="margin: 0 0 8px; color: #94a3b8;">
            ${headOfficeAddress}
          </p>
          <div style="border-top: 1px solid #1e293b; padding-top: 8px; margin-top: 8px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <span>📞 <strong>${helplineLabel}</strong> <a href="tel:+8801942791004" style="color: #38bdf8; text-decoration: none; font-weight: bold;">+880 1942-791004</a></span>
            <span>✉️ <strong>${supportEmailLabel}</strong> <a href="mailto:sojibahmedshorif25@gmail.com" style="color: #34d399; text-decoration: none; font-weight: bold;">sojibahmedshorif25@gmail.com</a></span>
          </div>
        </div>
      </div>

      <!-- Professional Footer -->
      <div style="background: #020617; padding: 22px 30px; text-align: center; font-size: 11px; color: #475569; border-top: 1px solid #1e293b;">
        <p style="margin: 0 0 4px; font-weight: 600; color: #64748b;">
          © 2026 <strong>Shopx-BD-Enterprise</strong>. All rights reserved.
        </p>
        <p style="margin: 0; color: #334155;">
          Secure 256-Bit SSL Encrypted • BSTI Certified Multi-Vendor Cloud Ecosystem
        </p>
      </div>

    </div>
  </body>
  </html>
  `;
};

/**
 * 2. Order Confirmation & Digital Invoice Template
 */
export const generateOrderEmailTemplate = (order: any, lang: 'en' | 'bn' = 'en'): string => {
  const isBn = lang === 'bn';
  const headOfficeAddress = isBn
    ? 'রৌমারী, কুড়িগ্রাম, রংপুর, বাংলাদেশ'
    : 'Rowmari, Kurigram, Rangpur, Bangladesh';

  const itemsHtml = (order.items || [])
    .map(
      (item: any) => `
    <tr style="border-bottom: 1px solid #1e293b;">
      <td style="padding: 12px; color: #e2e8f0; font-size: 13px; font-weight: 600;">${item.title || item.product?.title || 'Product Item'}</td>
      <td style="padding: 12px; text-align: center; color: #94a3b8; font-size: 13px;">x${item.quantity}</td>
      <td style="padding: 12px; text-align: right; color: #34d399; font-weight: 800; font-family: monospace; font-size: 13px;">৳${item.price * item.quantity}</td>
    </tr>`
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopx-BD-Enterprise Invoice</title>
  </head>
  <body style="margin: 0; padding: 32px 10px; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="max-width: 580px; margin: 0 auto; background: #0b1322; border-radius: 32px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.9);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #020617 0%, #064e3b 60%, #042f2e 100%); padding: 36px 30px; text-align: center; border-bottom: 1px solid #1e293b;">
        <div style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 50px; height: 50px; border-radius: 16px; line-height: 50px; text-align: center; font-size: 22px; font-weight: 900; color: #ffffff; margin-bottom: 12px;">SX</div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff;">ShopX <span style="color: #34d399;">Enterprise</span></h1>
        <p style="margin: 6px 0 0; color: #94a3b8; font-size: 12px;">${isBn ? 'অফিসিয়াল অর্ডার নিশ্চিতকরণ ও ডিজিটাল ক্যাশ মেমো' : 'Official Order Confirmation & Digital Invoice'}</p>
      </div>

      <div style="padding: 32px 30px;">
        <div style="background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; padding: 14px 18px; border-radius: 12px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 4px; color: #34d399; font-size: 15px;">${isBn ? `অভিনন্দন, ${order.customerInfo?.name || 'সম্মানিত গ্রাহক'}!` : `Thank you, ${order.customerInfo?.name || 'Customer'}!`}</h3>
          <p style="margin: 0; color: #cbd5e1; font-size: 12px;">${isBn ? 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। দ্রুততম সময়ে ডেলিভারি সম্পন্ন হবে।' : 'Your order has been verified and queued for express doorstep delivery.'}</p>
        </div>

        <div style="background: #030712; border: 1px solid #1e293b; border-radius: 18px; padding: 18px; margin-bottom: 20px; font-size: 12px; color: #cbd5e1; line-height: 1.8;">
          <p style="margin: 0;"><strong>${isBn ? 'অর্ডার নম্বর:' : 'Order ID:'}</strong> <span style="font-family: monospace; color: #38bdf8; font-weight: bold;">#${order.orderId || 'SX-889894'}</span></p>
          <p style="margin: 0;"><strong>${isBn ? 'মোবাইল:' : 'Phone:'}</strong> ${order.customerInfo?.phone || '017XXXXXXXX'}</p>
          <p style="margin: 0;"><strong>${isBn ? 'ডেলিভারি ঠিকানা:' : 'Delivery Address:'}</strong> ${order.customerInfo?.address || 'N/A'}, ${order.customerInfo?.district || 'Bangladesh'}</p>
          <p style="margin: 0;"><strong>${isBn ? 'পেমেন্ট মেথড:' : 'Payment:'}</strong> ${String(order.paymentMethod || 'Cash on Delivery').toUpperCase()}</p>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
          <thead>
            <tr style="background: #030712; text-align: left; border-bottom: 1px solid #1e293b;">
              <th style="padding: 10px; color: #94a3b8;">${isBn ? 'আইটেম' : 'Item Description'}</th>
              <th style="padding: 10px; text-align: center; color: #94a3b8;">${isBn ? 'পরিমাণ' : 'Qty'}</th>
              <th style="padding: 10px; text-align: right; color: #94a3b8;">${isBn ? 'মূল্য' : 'Total'}</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Summary -->
        <div style="border-top: 2px dashed #1e293b; padding-top: 14px; text-align: right; font-size: 12px; color: #94a3b8; line-height: 1.8;">
          <p style="margin: 0;">${isBn ? 'সাবটোটাল:' : 'Subtotal:'} ৳${order.subTotal || order.totalAmount}</p>
          <p style="margin: 0;">${isBn ? 'ডেলিভারি চার্জ:' : 'Shipping Charge:'} ৳${order.deliveryFee ?? 60}</p>
          <h2 style="margin: 10px 0 0; font-size: 20px; color: #ffffff;">${isBn ? 'সর্বমোট প্রদেয় বিল:' : 'Total Payable:'} <span style="color: #34d399; font-family: monospace;">৳${order.totalAmount}</span></h2>
        </div>

        <!-- Corporate Support -->
        <div style="border-top: 1px solid #1e293b; margin-top: 24px; padding-top: 18px; font-size: 11px; color: #64748b; line-height: 1.8;">
          <p style="margin: 2px 0;">🏢 <strong>${isBn ? 'হেড অফিস:' : 'Head Office:'}</strong> ${headOfficeAddress}</p>
          <p style="margin: 2px 0;">📞 <strong>${isBn ? '২৪/৭ হেল্পলাইন:' : '24/7 Helpline:'}</strong> +880 1942-791004 • ✉️ sojibahmedshorif25@gmail.com</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #020617; padding: 20px 30px; text-align: center; font-size: 11px; color: #475569; border-top: 1px solid #1e293b;">
        <p style="margin: 0; color: #64748b;">© 2026 <strong>Shopx-BD-Enterprise</strong>. All rights reserved.</p>
      </div>

    </div>
  </body>
  </html>
  `;
};

/**
 * 3. Password Reset Template
 */
export const generatePasswordResetEmailTemplate = (
  otp: string,
  name?: string,
  lang: 'en' | 'bn' = 'en'
): string => {
  const isBn = lang === 'bn';
  const headOfficeAddress = isBn
    ? 'রৌমারী, কুড়িগ্রাম, রংপুর, বাংলাদেশ'
    : 'Rowmari, Kurigram, Rangpur, Bangladesh';

  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"></head>
  <body style="margin: 0; padding: 32px 10px; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="max-width: 560px; margin: 0 auto; background: #0b1322; border-radius: 28px; overflow: hidden; border: 1px solid #1e293b;">
      <div style="background: linear-gradient(135deg, #020617 0%, #312e81 60%, #0f172a 100%); padding: 36px 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff;">ShopX <span style="color: #818cf8;">Enterprise</span></h1>
        <p style="margin: 6px 0 0; color: #cbd5e1; font-size: 12px;">${isBn ? '🔑 পাসওয়ার্ড পরিবর্তন সিকিউরিটি ওটিপি' : '🔑 Password Reset Verification Code'}</p>
      </div>
      <div style="padding: 32px 30px;">
        <p style="color: #f1f5f9; font-size: 15px; margin-bottom: 10px;">Hello <strong>${name || 'User'}</strong>,</p>
        <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">
          ${isBn ? 'আপনার পাসওয়ার্ড পরিবর্তনের জন্য নিচের ৬-সংখ্যার ওটিপি ব্যবহার করুন।' : 'Use the following 6-digit security code to reset your password. It expires in 10 minutes.'}
        </p>
        
        <div style="background: #030712; border: 2px dashed #818cf8; border-radius: 20px; padding: 20px; text-align: center; margin: 22px 0;">
          <span style="font-size: 38px; font-weight: 900; letter-spacing: 12px; color: #a5b4fc; font-family: monospace;">${otp}</span>
        </div>

        <div style="border-top: 1px solid #1e293b; margin-top: 22px; padding-top: 16px; font-size: 11px; color: #64748b; line-height: 1.8;">
          <p style="margin: 2px 0;">🏢 Head Office: ${headOfficeAddress}</p>
          <p style="margin: 2px 0;">📞 Helpline: +880 1942-791004</p>
        </div>
      </div>
    </div>
  </body>
  </html>`;
};
