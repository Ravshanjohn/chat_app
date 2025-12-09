export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4caf50, #45a049); padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
    <h1 style="color: #fff; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
    <p>Click the button below to confirm your email:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{verificationURL}"
        style="background-color: #4caf50; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
        Verify Email
      </a>
    </div>
    <p>This link will expire in 8 hours for security reasons.</p>
    <p>Best regards,<br>{senderName}</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message. Please do not reply.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Updated Successfully</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #2196F3, #1976D2); padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
    <h1 style="color: #fff; margin: 0;">Email Updated Successfully</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Your account email has been successfully updated.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #2196F3; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 28px;">
        ✓
      </div>
    </div>
    <p>If you did not make this change, please contact me immediately so I can help secure your account.</p>
    <p>For your security, I recommend:</p>
    <ul>
      <li>Ensuring this email is private and accessible only to you</li>
      <li>Reviewing your security settings regularly</li>
      <li>Using strong passwords for your account</li>
    </ul>
    <p>Thank you for keeping your account safe.</p>
    <p>Best regards,<br>{senderName}</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message. Please do not reply.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4caf50, #45a049); padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
    <h1 style="color: #fff; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>You requested to reset your password. If you didn’t make this request, you can safely ignore this email.</p>
    <p>Click the button below to set a new password:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}"
        style="background-color: #4caf50; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
        Reset Password
      </a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>{senderName}</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message. Please do not reply.</p>
  </div>
</body>
</html>
`;
export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;"> 
    <h1 style="color: white; margin: 0;">Welcome to My Chat App!</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hi {fullName},</p>
    <p>I'm thrilled to have you here! Thank you for signing up for my app.</p>
    <p>Here are a few tips to help you get started:</p>
    <ul>
      <li>Explore the features and customize your profile.</li>
      <li>Connect with friends and start chatting.</li>
      <li>Check the help section if you ever need assistance.</li>
    </ul>
    <p>I want you to have the best possible experience with this app. If you ever need help, have questions, or want to suggest improvements, I’m always here to assist you.</p>
    <p>Once again, welcome aboard! We're excited to have you with us.</p>
    <p>Best regards,<br>{senderName}</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;