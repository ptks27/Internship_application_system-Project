export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Email</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
    body {
      font-family: 'Poppins', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #ffffff;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      color: #723bcf;
      padding: 20px 0;
    }
    .content {
      text-align: center;
      background-color: #723bcf;
      color: #ffffff;
      padding: 20px;
      margin: 0 auto;
      width: 80%;
      max-width: 400px;
    }
    .content p {
      font-family: 'Poppins', sans-serif;
      font-weight: 50;
      font-style: italic;
      letter-spacing: 2px;
      margin: 0;
   color: #ffffff;
    }
    h1 {
      font-size: 30px;
      font-weight: bold;
      margin: 0;
    }
    .container {
      text-align: center; 
      padding: 20px;
      width: 80%;
      max-width: 400px;
      margin: 0 auto;
    }
    h2 {
      color: #ffffff;
      font-size: 24px;
      font-weight: bold;
      margin: 20px 0;
    }
    .g {
margin-top:30px
}
    .code {
      font-size: 24px;
      font-weight: bold;
      color: #723bcf;
      margin: 20px 0;
    }
    .b{
     font-weight: bold;
}
    .footer {
      text-align: center;
      background-color: #723bcf;
      color: #ffffff;
      padding: 10px;
      font-size: 12px;
      margin: 0 auto;
      width: 80%;
      max-width: 400px;
    }
    @media only screen and (max-width: 480px) {
      .email-container {
        padding: 10px;
      }
      .content, .container, .footer {
        width: 100%;
      }
      h1 {
        font-size: 24px;
      }
      h2 {
        font-size: 20px;
      }
      .code {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>THE TRAINEE.</h1>
    </div>
    <div class="content">
<p>THANKS FOR SIGNING UP!</p>
<h2>Verify Your E-mail Address</h2>

      
    </div>
    <div class="container">
      <p>Hello,</p>
      <p>We are very excited that you are interested in joining our website, <br> In the beginning Please use this verification.</p><br>
 <p class="code">{verificationCode}</p>
     <div class="g">
       <p class="b">This code will be valid for the next 10 minutes.</p>
 <p >Thank you for joining us!</p>
 </div>

    </div>
    <div class="footer">
      <p>Copyrights © Company All Rights Reserved</p>
    </div>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password Success</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
    body {
      font-family: 'Poppins', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #ffffff;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      color: #723bcf;
      padding: 20px 0;
    }
    .content {
      text-align: center;
      background-color: #723bcf;
      color: #ffffff;
      padding: 20px;
      margin: 0 auto;
      width: 80%;
      max-width: 400px;
    }
    .content p {
      font-family: 'Poppins', sans-serif;
      font-weight: 50;
      font-style: italic;
      letter-spacing: 2px;
      margin: 0;
   color: #ffffff;
    }
    h1 {
      font-size: 30px;
      font-weight: bold;
      margin: 0;
    }
    .container {
      text-align: center; 
      padding: 20px;
      width: 80%;
      max-width: 400px;
      margin: 0 auto;
    }
    h2 {
      color: #ffffff;
      font-size: 24px;
      font-weight: bold;
      margin: 20px 0;
    }
    .g {
margin-top:30px
}
    .code {
      font-size: 24px;
      font-weight: bold;
      color: #723bcf;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      background-color: #723bcf;
      color: #ffffff;
      padding: 10px;
      font-size: 12px;
      margin: 0 auto;
      width: 80%;
      max-width: 400px;
    }
    @media only screen and (max-width: 480px) {
      .email-container {
        padding: 10px;
      }
      .content, .container, .footer {
        width: 100%;
      }
      h1 {
        font-size: 24px;
      }
      h2 {
        font-size: 20px;
      }
      .code {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>THE TRAINEE.</h1>
    </div>
    <div class="content">
<h2>Reset Password Success</h2>
<p>WE WANTED TO LET YOU KNOW THAT YOUR <br> ACCOUNT HAS BEEN SUCCESSFULLY UPDATED.</p>
      
    </div>
    <div class="container">
      <p>Hello,</p>
      <p>If you made this change, you're all set! If you didn't make this change, <br> please contact our support team immediately.</p>
     <div class="g">
       <p>Best wishes,<br>The Trainee Team.</p>
 </div>

    </div>
    <div class="footer">
      <p>Copyrights © Company All Rights Reserved</p>
    </div>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
    body {
      font-family: 'Poppins', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #ffffff;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      color: #723bcf;
      padding: 20px 0;
    }
    .content {
      text-align: center;
      background-color: #723bcf;
      color: #ffffff;
      padding: 20px;
      margin: 0 auto;
      width: 80%;
      max-width: 400px;
    }
    .content p {
      font-family: 'Poppins', sans-serif;
      font-weight: 100;
      font-style: italic;
      letter-spacing: 2px;
      margin: 0;
    }
    h1 {
      font-size: 30px;
      font-weight: bold;
      margin: 0;
    }
    .container {
      text-align: center; 
      padding: 20px;
      width: 80%;
      max-width: 400px;
      margin: 0 auto;
    }
    h2 {
      color: #ffffff;
      font-size: 24px;
      font-weight: bold;
      margin: 20px 0;
    }
    .code {
      font-size: 24px;
      font-weight: bold;
      color: #723bcf;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      background-color: #723bcf;
      color: #ffffff;
      padding: 10px;
      font-size: 12px;
      margin: 0 auto;
      width: 80%;
      max-width: 400px;
    }
    .b{
      font-weight: bold;
}
    @media only screen and (max-width: 480px) {
      .email-container {
        padding: 10px;
      }
      .content, .container, .footer {
        width: 100%;
      }
      h1 {
        font-size: 24px;
      }
      h2 {
        font-size: 20px;
      }
      .code {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>THE TRAINEE.</h1>
    </div>
    <div class="content">
      <h2>Reset Your Password</h2>
    </div>
    <div class="container">
      <p>Hello,</p>
      <p>We received a request to update your account security settings. <br> If this was you, please use the following code to confirm this action.</p><br>
      <p class="code">{resetOTP}</p><br>
<p class="b">This code will be valid for the next 10 minutes.</p>
      <p>If you didn't request this change, please disregard this message.<br>Your account remains secure.</p>
    </div>
    <div class="footer">
      <p>Copyrights © Company All Rights Reserved</p>
    </div>
  </div>
</body>
</html>
`;
