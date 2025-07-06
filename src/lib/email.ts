import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface ComplaintData {
  title: string;
  description: string;
  category: string;
  priority: string;
  status?: string;
  attachments?: Array<{
    originalName: string;
    filename: string;
    mimetype: string;
    size: number;
    url: string;
    thumbnailUrl?: string;
    processedUrl?: string;
  }>;
}

// Create transporter
const createTransporter = () => {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  };

  return nodemailer.createTransport(config);
};

// Send email for new complaint
export const sendNewComplaintEmail = async (complaint: ComplaintData) => {
  try {
    const transporter = createTransporter();
    const adminEmail = process.env.ADMIN_EMAIL!;

    const mailOptions = {
      from: process.env.SMTP_USER!,
      to: adminEmail,
      subject: `New Complaint: ${complaint.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976d2;">New Complaint Submitted</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>${complaint.title}</h3>
            <p><strong>Category:</strong> ${complaint.category}</p>
            <p><strong>Priority:</strong> <span style="color: ${
              complaint.priority === 'High' ? '#d32f2f' : 
              complaint.priority === 'Medium' ? '#ed6c02' : '#2e7d32'
            };">${complaint.priority}</span></p>
            <p><strong>Description:</strong></p>
            <p style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #1976d2;">
              ${complaint.description}
            </p>
            ${complaint.attachments && complaint.attachments.length > 0 ? `
            <p><strong>Attachments (${complaint.attachments.length}):</strong></p>
            <ul style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #1976d2;">
              ${complaint.attachments.map(attachment => `
                <li>${attachment.originalName} (${(attachment.size / 1024).toFixed(1)} KB)</li>
              `).join('')}
            </ul>
            ` : ''}
            <p><strong>Date Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            Please log into the admin dashboard to review and manage this complaint.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('New complaint email sent successfully');
  } catch (error) {
    console.error('Error sending new complaint email:', error);
    // Don't throw error to avoid breaking the complaint submission
  }
};

// Send email for status update
export const sendStatusUpdateEmail = async (complaint: ComplaintData, oldStatus: string) => {
  try {
    const transporter = createTransporter();
    const adminEmail = process.env.ADMIN_EMAIL!;

    const mailOptions = {
      from: process.env.SMTP_USER!,
      to: adminEmail,
      subject: `Complaint Status Updated: ${complaint.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976d2;">Complaint Status Updated</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>${complaint.title}</h3>
            <p><strong>Status Changed:</strong> <span style="color: #d32f2f;">${oldStatus}</span> → <span style="color: #2e7d32;">${complaint.status}</span></p>
            <p><strong>Category:</strong> ${complaint.category}</p>
            <p><strong>Priority:</strong> ${complaint.priority}</p>
            <p><strong>Date Updated:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            The complaint status has been successfully updated in the system.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Status update email sent successfully');
  } catch (error) {
    console.error('Error sending status update email:', error);
    // Don't throw error to avoid breaking the status update
  }
}; 