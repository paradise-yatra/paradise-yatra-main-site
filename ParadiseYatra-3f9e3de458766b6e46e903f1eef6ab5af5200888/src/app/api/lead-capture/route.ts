import { NextRequest, NextResponse } from "next/server";
import { createTransport } from "nodemailer";

interface LeadData {
  fullName: string;
  email: string;
  phone: string;
  destination?: string;
  budget?: string;
  message: string;
  newsletterConsent: boolean;
  packageTitle?: string;
  packagePrice?: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadData = await request.json();

    // Validate required fields
    const requiredFields = ["fullName", "email", "phone", "message"] as const;
    for (const field of requiredFields) {
      if (!body[field] || typeof body[field] !== "string" || body[field].trim() === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone number
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = body.phone.replace(/[\s\-\(\)]/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Create email transporter (SMTP)
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpUser = process.env.SMTP_USER;
    const smtpPassRaw = process.env.SMTP_PASS;
    const smtpPass = (smtpPassRaw || "").replace(/^"(.*)"$/, "$1");
    const smtpSecure =
      process.env.SMTP_SECURE !== undefined
        ? process.env.SMTP_SECURE === "true"
        : smtpPort === 465;

    const isSmtpConfigured = Boolean(smtpHost && smtpUser && smtpPass);

    // Email content
    const emailSubject = `New Travel Inquiry - ${body.packageTitle || "General Inquiry"}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Travel Inquiry</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .package-info { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .timestamp { color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 New Travel Inquiry</h1>
            <p>You have received a new travel inquiry from ParadiseYatra</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Full Name:</div>
              <div class="value">${body.fullName}</div>
            </div>
            <div class="field">
              <div class="label">Email Address:</div>
              <div class="value">${body.email}</div>
            </div>
            <div class="field">
              <div class="label">Phone Number:</div>
              <div class="value">${body.phone}</div>
            </div>
            <div class="field">
              <div class="label">Destination:</div>
              <div class="value">${body.destination || 'Not specified'}</div>
            </div>
            <div class="field">
              <div class="label">Budget:</div>
              <div class="value">${body.budget || 'Not specified'}</div>
            </div>
            <div class="field">
              <div class="label">Message/Requirements:</div>
              <div class="value">${body.message.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="field">
              <div class="label">Newsletter Consent:</div>
              <div class="value">${body.newsletterConsent ? '✅ Yes - Subscribed to newsletter' : '❌ No - Not subscribed to newsletter'}</div>
            </div>
            ${body.packageTitle ? `
            <div class="package-info">
              <div class="field">
                <div class="label">Package:</div>
                <div class="value">${body.packageTitle}</div>
              </div>
              ${body.packagePrice ? `
              <div class="field">
                <div class="label">Price:</div>
                <div class="value">${body.packagePrice}</div>
              </div>
              ` : ''}
            </div>
            ` : ''}
            <div class="timestamp">
              Inquiry received on: ${new Date(body.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `
New Travel Inquiry - ParadiseYatra

Full Name: ${body.fullName}
Email: ${body.email}
Phone: ${body.phone}
Destination: ${body.destination || 'Not specified'}
Budget: ${body.budget || 'Not specified'}

Message/Requirements:
${body.message}

Newsletter Consent: ${body.newsletterConsent ? 'Yes - Subscribed to newsletter' : 'No - Not subscribed to newsletter'}

${body.packageTitle ? `Package: ${body.packageTitle}` : ''}
${body.packagePrice ? `Price: ${body.packagePrice}` : ''}

Inquiry received on: ${new Date(body.timestamp).toLocaleString()}
    `;

    // Save lead to database
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";
    let leadSaved = false;
    let emailSent = false;
    let emailWarning: string | null = null;

    try {
      const dbResponse = await fetch(`${backendUrl}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...body,
          timestamp: body.timestamp || new Date().toISOString(),
        }),
      });

      if (!dbResponse.ok) {
        console.error("Failed to save lead to database:", await dbResponse.text());
      } else {
        leadSaved = true;
        console.log("Lead saved to database successfully");
      }
    } catch (dbError) {
      console.error("Error connecting to backend to save lead:", dbError);
      // Continue and try email notification as a fallback signal.
    }

    // Send email notification only when SMTP is configured.
    if (isSmtpConfigured) {
      try {
        const transporter = createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const mailOptions = {
          from: smtpUser,
          to: smtpUser,
          subject: emailSubject,
          text: emailText,
          html: emailHtml,
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
      } catch (mailError) {
        console.error("Failed to send lead notification email:", mailError);
        emailWarning = "Lead saved, but notification email could not be sent.";
      }
    } else {
      emailWarning = "Lead saved without email notification (SMTP not configured).";
      console.warn("SMTP not configured. Skipping email notification.");
    }

    if (!leadSaved && !emailSent) {
      return NextResponse.json(
        { error: "Failed to submit inquiry. Please try again later." },
        { status: 500 }
      );
    }

    // Log the lead
    console.log("New lead captured and processed:", {
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      packageTitle: body.packageTitle,
      timestamp: body.timestamp,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry submitted successfully",
        ...(emailWarning ? { warning: emailWarning } : {})
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error processing lead capture:", error);

    return NextResponse.json(
      {
        error: "Failed to submit inquiry. Please try again later."
      },
      { status: 500 }
    );
  }
} 
