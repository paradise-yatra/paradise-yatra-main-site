import { NextRequest, NextResponse } from "next/server";
import { createTransport } from "nodemailer";

interface LeadData {
  fullName: string;
  email: string;
  phone: string;
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

    // Create email transporter
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

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

Message/Requirements:
${body.message}

Newsletter Consent: ${body.newsletterConsent ? 'Yes - Subscribed to newsletter' : 'No - Not subscribed to newsletter'}

${body.packageTitle ? `Package: ${body.packageTitle}` : ''}
${body.packagePrice ? `Price: ${body.packagePrice}` : ''}

Inquiry received on: ${new Date(body.timestamp).toLocaleString()}
    `;

    // Send email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // You can change this to any email address
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    // Log the lead (you can also save to database here)
    console.log("New lead captured:", {
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      packageTitle: body.packageTitle,
      timestamp: body.timestamp,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Inquiry submitted successfully" 
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