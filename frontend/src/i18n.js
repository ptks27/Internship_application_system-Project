import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLanguage = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: "THE TRAINEE.",
        login: "Login",
        signup: "Sign Up",
        english: "English",
        thai: "Thai",
        chooseJobInterest: "Choose the job that interests you.",
        latestAndTop: "Latest and Top",
        jobOpenings: "Job Openings",
        noJobAvailable: "No Job Available",

        search: "Search",
        apply: "Apply",
        get: "Get",
        getDreamJobs: "Your Dream Jobs",
        findDreamJobs: "Find Your dream jobs",
        platformDescription:
          "We are a platform that helps facilitate finding internship companies",
        forYou: "for you and finding interns for your company.",
        location: "Location",
        position: "Position",
        salary: "Salary",
        filterJobs: "Filter Jobs",
        clearAllFilters: "Clear All Filters",
        appliedJobs: "Applied Jobs",
        company: "Company",
        jobPosition: "Job Position",
        date: "Date",
        status: "Status",
        details: "Details",
        saveForLater: "Save For Later",
        today: "Today",
        daysAgo: "days ago",
        positions: "Positions",
        updateProfile: "Update Profile",
        name: "Name",
        email: "Email",
        phone: "Phone",
        bio: "Bio",
        skills: "Skills",
        resume: "Resume",
        changePhoto: "Change Photo",
        searchResults: "Search results for",
        allWork: "All work",
        noJobFound: "No job found",
        tryAdjusting: "Try adjusting your search criteria",
        jobInformation: "Job Information",
        experience: "Experience",
        postedDate: "Posted Date",
        applyNow: "Apply Now",
        alreadyApplied: "Already Applied",
        description: "Description",
        year: "year",
        fullname: "Full Name",
        phoneNumber: "Phone Number",
        updateYourProfile: "Update Your Profile",
        cannotSelectMoreThan: "Cannot select more than 3 bios.",
        unexpectedError: "An unexpected error occurred. Please try again.",
        Description: "Description",
        home: "Home",
        jobs: "Jobs",
        history: "History",
        companies: "Companies",
        viewProfile: "View Profile",
        logout: "Logout",
        traineeApply: "Trainee Apply",
        recentAppliedUsers: "A list of your recent applied users",
        action: "Action",
        viewResume: "View Resume",
        previous: "Previous",
        next: "Next",
        page: "Page",
        of: "of",
        accepted: "Accepted",
        rejected: "Rejected",
        myCompany: "My Company",
        filterByName: "Filter by name",
        newCompany: "New Company",
        updateCompany: "Update Company",
        companyName: "Company Name",
        enterCompanyName: "Enter company name",
        agentName: "Agent Name",
        enterAgentName: "Enter agent name (Thai or English only)",
        enterLocation: "Enter location",
        enterEmailAddress: "Enter email address",
        enterPhoneNumber: "Enter 10-digit phone number",
        companyLogo: "Company Logo",
        chooseFile: "Choose file",
        updating: "Updating...",
        loadingCompanyData: "Loading company data...",
        pleaseWait: "Please wait while we fetch the company information.",
        pleaseWaitLogin: "Please wait",
        createYourCompany: "Create Your Company",
        letsGetStarted: "Let's get started by setting up your company profile.",
        continue: "Continue",
        cancel: "Cancel",
        recentlyRegisteredCompanies: "A list of recently registered companies",
        logo: "Logo",
        noCompaniesFound: "No companies found",
        notAvailable: "N/A",
        edit: "Edit",
        delete: "Delete",
        areYouSure: "Are you sure?",
        cantRevert: "You won't be able to revert this!",
        yesDelete: "Yes, delete it!",
        somethingWentWrong: "Something went wrong!",
        back: "Back",
        update: "Update",
        companySetup: "Company Setup",
        companyNameRequired: "Please specify the company name.",
        agentNameRequired: "Please specify the agent name.",
        agentNameMinLength: "Agent name must be at least 3 characters long",
        agentNameMaxLength: "Agent name must not exceed 100 characters",
        agentNameOnlyThaiEnglish:
          "Agent name can only contain Thai or English letters",
        emailRequired: "Please specify the email.",
        invalidEmailFormat: "Invalid email format",
        descriptionRequired: "Please specify the Description.",
        descriptionMinLength: "Description must be at least 10 characters long",
        descriptionMaxLength: "Description must not exceed 400 characters",
        locationRequired: "Please specify the Location.",
        phoneNumberRequired: "Please specify the Phone number.",
        phoneNumberLength: "Phone number must be between 8 and 13 digits",
        // Placeholders
        enterCompanyDescription: "Enter company description",
        enterEmail: "Enter email address",
        jobPositions: "Job Positions",
        filterByCompanyAndRole: "Filter by Company and role",
        newJob: "New Job",
        recentlyPostedJobs: "A list of recently posted jobs",
        noJobsPostedYet: "You haven't posted any jobs yet",
        wantToDeleteJob: "You want to delete this job?",
        role: "Role",
        applicants: "Applicants",
        // Add new translations for PostJobs
        jobSetup: "Job Setup",
        enterJobPosition: "Enter job position",
        enterJobDescription: "Enter job description",
        enterSalary: "Enter salary",
        numberOfPositions: "Number of Positions",
        enterNumberOfPositions: "Enter number of positions",
        experienceLevel: "Experience Level",
        enterExperienceLevel: "Enter experience level",
        jobType: "Job Type",
        selectJobType: "Select Job Type",
        selectCompany: "Select a Company",
        postJob: "Post Job",
        posting: "Posting...",
        pleaseRegisterCompany:
          "Please register a company first, before posting a job",
        fillAllFields: "Please fill in all required fields correctly.",
        // Add new translations for UpdateJobs
        updateJob: "Update Job",
        enterFullname: "Enter your full name",

        fullnameMinLength: "Full name must be at least 5 characters long",
        fullnameMaxLength: "Full name must not exceed 30 characters",
        fullnameOnlyThaiEnglish: "Please enter only Thai or English characters",
        phoneNumberOnlyDigits: "Please enter only digits",

        phoneNumberStartWithZero: "Phone number must start with 0",

        invalidEmail: "Invalid email format",
        passwordRequired: "Please enter your password",
        passwordTooLong: "Password must not exceed 30 characters",
        welcomeSubtitle: "Welcome to our Website.",

        enterPassword: "Enter password",
        student: "Student",
        agent: "Agent",
        forgotPassword: "Forgot Password?",
        password: "Password",
        forgotPassword1: "Forgot Password",
        selectProvince: "Select Province",
        selectDistrict: "Select District",
        dontHaveAccount: "Don't have an account?",
        createNewAccount: "Create your",
        newAccount: "new account",
        profilePicture: "Profile Picture",
        fullnameError:
          "Please enter your full name between 5 and 50 characters. Do not use numbers or special characters.",
        phoneNumberError: "Please enter 10 digits for the phone number.",
        roleError: "Please select your role.",
        alreadyHaveAccount: "Already have an account?",
        confirmPassword: "Confirm Password",
        emailSentSuccessfully: "Email sent successfully!",
        pleaseCheckEmail: "Please check your email to proceed.",
        redirectingToOTP: "Redirecting to OTP page in",
        redirecting: "Redirecting...",
        enterOTP: "Enter OTP",
        otpSentTo: "We've sent a 7-digit OTP to",
        pleaseEnterBelow: "Please enter it below.",
        timeRemaining: "Time remaining:",
        verifyOTP: "Verify OTP",
        resendOTP: "Resend OTP",
        didntReceiveOTP:
          'Didn\'t receive the OTP? Check your spam email or click "Resend OTP".',
        invalidOTP: "Invalid OTP. Please try again.",
        newOTPSent: "New OTP sent successfully!",
        failedToResendOTP: "Failed to resend OTP",
        pleaseWaitForOTP:
          "Please wait for the current OTP to expire before requesting a new one.",
        passwordResetSuccessful: "Password Reset Successful!",
        passwordResetSuccessMessage:
          "Your password has been successfully reset.",
        redirectingToLoginPage: "Redirecting to login page in",
        resetPassword: "Reset Password",
        enterNewPasswordBelow:
          "Enter your new password below to regain access to your account.",
        newPassword: "New Password",
        confirmNewPassword: "Confirm New Password",
        passwordLengthCriterion: "Password must be at least 8 characters long.",
        passwordLowercaseCriterion:
          "Password must contain at least one lowercase letter.",
        passwordUppercaseCriterion:
          "Password must contain at least one uppercase letter.",
        passwordNumberCriterion: "Password must contain at least one number.",
        passwordSpecialCharCriterion:
          "Password must contain at least one special character (!@#$%^&*).",
        passwordsDoNotMatch: "Passwords do not match.",
        verifyYourEmail: "Verify Your Email",
        verificationCodeSentTo: "We've sent a verification code to",
        pleaseEnterCodeBelow: "Please enter the code below.",
        verifyingEmail: "Verifying email...",
        verifyEmail: "Verify Email",
        resendCode: "Resend Code",
        didntReceiveCode:
          'Didn\'t receive the code? Check your spam email or click "Resend Code".',
        youHaveNotAppliedForAnyJobs: "You have not applied for any jobs",
        noLogo: "No logo",
        currency: "THB",
        jobTypeNotSpecified: "Job type not specified",
        pending: "Pending",
        // Add new translations for Signup
        createAccount: "Create Account",
        phoneNumberPlaceholder: "Enter your phone number",
        emailPlaceholder: "Enter your email",
        passwordPlaceholder: "Enter your password",
        confirmPasswordPlaceholder: "Confirm your password",
        selectRole: "Select your role",
        uploadProfilePicture: "Upload Profile Picture",
        signupButton: "Sign Up",

        loginHere: "Login here",
        fullnameValidation:
          "Please enter your full name (5-50 characters, no numbers or special characters)",
        phoneNumberValidation: "Please enter a valid 8-13 digit phone number",
        emailValidation: "Please enter a valid email address",
        passwordValidation: "Password must be at least 8 characters long",
        confirmPasswordValidation: "Passwords do not match",
        roleValidation: "Please select a role",
        fileValidation: "Please select a valid image file (PNG, JPG, JPEG)",
        // Add new translations for email validation
        emailEnterEnglish: "Please enter English.",
        emailMaxCharacters:
          "Please enter no more than 20 characters before '@'.",
        emailValidDomains:
          "Please enter a valid email address (use only @gmail.com, @outlook.com, @yahoo.com, or @hotmail.com).",
        // Add new translation for file validation
        fileValidationMessage: "Please select files .png .jpeg .jpg only.",
        fillAllFieldsCorrectly: "Please fill in all required fields correctly.",
        expiringsSoon: "About to expire",
        applyConfirmation: "Are you sure?",
        applyWarning:
          "You won't be able to cancel this application once submitted!",
        yesApply: "Yes, apply!",

        applyError: "An error occurred while applying for the job.",
        notifications: "Notifications",
        newApplicationNotification: "New Application",
        jobApplicationNotification: "Job Application",
        unknownJob: "Unknown Job",
        unknownCompany: "Unknown Company",
        generalNotification: "General Notification",

        noNotifications: "No notifications",
        deleteNotification: "Delete",
        youHaveAppliedForTheJob: "You have applied for the job : ",
        newApplicationReceived:
          "A new application has been received for the job : ",
        yourApplicationStatusUpdated:
          "Your application status has been updated : ",
        applicationAccepted:
          "Your application has been accepted for the position:",
        applicationRejected:
          "Your application has been rejected for the position:",
        atCompany: "at company",
        yourApplicationFor: "Your application for",
        positionHasBeen: "position has been",
        updated: "updated",
        notificationDeleted: "Notification deleted successfully",
        errorDeletingNotification: "Error deleting notification",
        on: "on",
        unknownDate: "Unknown Date",
        allNotificationsMarkedAsRead: "All notifications marked as read",
        errorMarkingNotificationsAsRead: "Error marking notifications as read",
        markAllAsRead: "Mark all as read",
        nameUpdatedSuccessfully: "Name updated successfully",
        errorUpdatingName: "Error updating name",
        // Add new translations for UpdateProfile
        updateProfileTitle: "Update Profile",
        uploadNewPhoto: "Upload New Photo",
        removePhoto: "Remove Photo",
        uploadResume: "Upload Resume",
        removeResume: "Remove Resume",
        bioPlaceholder: "Select your bio (max 3)",
        skillsPlaceholder: "Select your skills",
        // Validation messages
        fullnameTooShort: "Please enter at least 5 characters",
        fullnameTooLong: "Maximum 30 characters allowed",
        fullnameInvalidChars: "Only Thai or English characters allowed",
        phoneInvalidDigits: "Please enter numbers only",
        phoneInvalidLength: "Phone number must be 10 digits",
        phoneStartWithZero: "Phone number must start with 0",
        phoneAlreadyInUse: "This phone number is already in use",
        // Success messages
        profileUpdateSuccess: "Profile updated successfully",
        // Error messages
        bioMaxSelection: "Cannot select more than 3 bios",
       
        fileTypeError: "Please select only PNG, JPG, or JPEG files",
      },
    },
    th: {
      translation: {
        expiringsSoon: "ใกล้หมดอายุ",
        pleaseWaitLogin: "กรุณารอสักครู่",
        jobTypeNotSpecified: "ประเภทงานไม่ระบุ",
        currency: "บาท",
        welcome: "THE TRAINEE.",
        login: "เข้าสู่ระบบ",
        signup: "สมัครสมาชิก",
        english: "อังกฤษ",
        thai: "ไทย",
        chooseJobInterest: "เลือกงานที่คุณสนใจ",
        latestAndTop: "ล่าสุดและยอดนิยม",
        jobOpenings: "ตำแหน่งงานที่เปิดรับ",
        noJobAvailable: "ไ่มีงานที่เปิดรับในขณะนี้",
        search: "ค้นหา",
        apply: "สมัคร",
        get: "รับ",
        getDreamJobs: "งานในฝันของคุณ",
        findDreamJobs: "ค้นหางานในฝันของคุณ",
        platformDescription:
          "เราเป็นแพลตฟอร์มที่ช่วยอำนวยความสะดวกในการหาบริษัทฝึกงาน",
        forYou: "สำหรับคุณและหานักศกษาฝึกงานให้กับบริษัทของคุณ",
        location: "สถานที่",
        position: "ตำแหน่ง",
        salary: "เงินเดือน",
        filterJobs: "กรองงาน",
        clearAllFilters: "ล้างตัวกรองทั้งหมด",
        appliedJobs: "งานที่สมัครแล้ว",
        company: "บริษัท",
        jobPosition: "ตำแหน่งงาน",
        date: "วันที่",
        status: "สถานะ",
        details: "รายละเอียด",
        saveForLater: "บันทึกไว้ดูภายหลัง",
        today: "วันนี้",
        daysAgo: "วัที่แล้ว",
        positions: "ตำแหน่ง",
        updateProfile: "อัปเดตโปรไฟล์",
        name: "ชื่อ",
        email: "อีเมล",
        phone: "โทรศัพท์",
        bio: "ประวัติย่อ",
        skills: "ทักษะ",
        resume: "ประวัติการทำงาน",
        changePhoto: "เปลี่ยนรูปภาพ",
        searchResults: "ผลการค้นหาสำหรับ",
        allWork: "งานทั้งหมด",
        noJobFound: "ไม่พบงาน",
        tryAdjusting: "ลองปรับเกณฑ์การค้นหาของคุณ",
        jobInformation: "ข้อมูลงาน",
        experience: "ประสบการณ์",
        postedDate: "วันที่โพสต์",
        applyNow: "สมัครเลย",
        alreadyApplied: "สมัครแล้ว",
        description: "รายละเอียด",
        year: "ปี",
        fullname: "ชื่อเต็ม",
        phoneNumber: "หมายเลขโทรศัพท์",
        updateYourProfile: "อัปเดตโปรไฟล์ของคุณ",
        cannotSelectMoreThan: "ไม่สามารถเลือกได้มากกว่า 3 ประวัติย่อ",
        unexpectedError: "เกิดข้อผิดพลาดที่ไม่คาดคิด โปรดลองอีกครั้ง",
        Description: "รายละเอียด",
        home: "หน้าหลัก",
        jobs: "งาน",
        history: "ประวัติ",
        companies: "บริษัท",
        viewProfile: "ดูโปรไฟล์",
        logout: "ออกจากระบบ",
        traineeApply: "ผู้สมัครฝึกงาน",
        recentAppliedUsers: "รายื่อผู้สมัครล่าสุด",
        action: "การดำเนินการ",
        viewResume: "ดูประวัติย่อ",
        selectProvince: "เลือกจังหวัด",
        selectDistrict: "เลือกเขต",
        previous: "ก่อนหน้า",
        next: "ถัดไป",
        page: "หน้า",
        of: "จาก",
        accepted: "ยอมรับ",
        rejected: "ปฏิเสธ",
        myCompany: "บริษัทของฉัน",
        filterByName: "กรองตามชื่อ",
        newCompany: "บริษัทใหม่",
        updateCompany: "อัปเดตบริษัท",
        companyName: "ชื่อบริษัท",
        enterCompanyName: "กรอกชื่อบริษัท",
        agentName: "ชื่อตัวแทน",
        enterAgentName: "กรอกชื่อตัวแทน (ภาษาไทยหรืออังกฤษเท่านั้น)",
        enterLocation: "กรอกสถานที่",
        enterEmailAddress: "กรอกที่อยู่อีเมล",
        enterPhoneNumber: "กรอกหมายเลขโทรศัพท์ 10 หลัก",
        companyLogo: "โลโก้บิษัท",
        chooseFile: "เลือกไฟล์",
        updating: "กำลังอัปเดต...",
        loadingCompanyData: "กำลังโหลดข้อมูลบริษัท...",
        pleaseWait: "กรุณารอสักครู่ขณะที่เรากำลังดึงข้อมูลบริษัท",
        createYourCompany: "สร้างบริษัทของคุณ",
        letsGetStarted: "มาเริ่มต้นด้วยการตั้งค่าโปรไฟล์บริษัทของคุณ",
        continue: "ดำเนินการต่อ",
        cancel: "ยกเลิก",
        recentlyRegisteredCompanies: "รายชื่อบริษัทที่ลงทะเบียนล่าสุด",
        logo: "โลโก้",
        noCompaniesFound: "ไม่พบบริษัท",
        notAvailable: "ไม่มีข้อมูล",
        edit: "แก้ไข",
        delete: "ลบ",
        areYouSure: "คุณแน่ใจหรือไม่?",
        cantRevert: "คุณจะไม่สามารถย้อนกลับการกระทำนี้ได้!",
        yesDelete: "ใช่, ลบเลย!",
        somethingWentWrong: "เกิดข้อผิดพลาดบางอย่าง!",
        back: "กลับ",
        update: "ัปเดต",
        companySetup: "กรอกข้อมูลบริษัท",
        companyNameRequired: "กรุณาระบุชื่อบริษัท",
        agentNameRequired: "กรุณาระบุชื่อตัวแทน",
        agentNameMinLength: "ชื่อตัวแทนต้องมีความยาวอย่างน้อย 3 ตัวอักษร",
        agentNameMaxLength: "ชื่อตัวแทนต้องไม่เกิน 100 ตัวอักษร",
        agentNameOnlyThaiEnglish: "ชื่อตัวแทนต้องเป็นภาษาไทยหรืออังกฤษเท่านั้น",
        emailRequired: "กรุณาระบุอีเมล",
        invalidEmailFormat: "รูปแบบอีเมลไม่ถูกต้อง",
        descriptionRequired: "กรุณาระบุคำอธิบาย",
        descriptionMinLength: "คำอธิบายต้องมีความยาวอย่างน้อย 10 ตัวอักษร",
        descriptionMaxLength: "คำอธิบายต้องไม่เกิน 400 ตัวอักษร",
        locationRequired: "กรุณาระบุสถานที่",
        phoneNumberRequired: "กุณาระบุหมายเลขโทรศัพท์",
        phoneNumberLength: "หมายเลขโทรศัพท์ต้องมีความยาวระหว่าง 8 ถึง 13 หลัก",
        companyNameMinLength: "ชื่อบริษัทต้องมีอย่างน้อย 2 ตัวอักษร",
        companyNameMaxLength: "ชื่อบริษัทต้องไม่มีความยาวมากกว่า 100 ตัวอักษร",
        companyRegisteredSuccess: "บริษัทลงทะเบียนสำเร็จ",
        failedToRegisterCompany: "ลงทะเบียนบริษัทไม่สำเร็จ",
        enterCompanyDescription: "กรอกคำอธิบายบริษัท",
        enterEmail: "กรอกที่อยู่อีเมล",
        jobPositions: "ตำแหน่งงาน",
        filterByCompanyAndRole: "กรองตาบริษัทและตำแหน่ง",
        newJob: "งานใหม่",
        recentlyPostedJobs: "รายการงานที่โพสต์่าสุด",
        noJobsPostedYet: "คุณยังไม่ได้โพสต์งานใดๆ",
        wantToDeleteJob: "คุณต้องการลบงานนี้หรือไม่?",
        role: "ตำแหน่ง",
        applicants: "ผู้สมัคร",
        // Add new translations for PostJobs
        jobSetup: "กรอกข้อมูลงาน",
        enterJobPosition: "กรอกตำแหน่งงาน",
        enterJobDescription: "กรอกรายละเอียดงาน",
        enterSalary: "กรอกเงินเดือน",
        numberOfPositions: "จำนวนตำแหน่งที่เปิดรับ",
        enterNumberOfPositions: "กรอกจำนวนตำแหน่งที่เปิดรับ",
        experienceLevel: "ระดับประสบการณ์",
        enterExperienceLevel: "กรอกระดับประสบการณ์",
        jobType: "ประเภทงาน",
        selectJobType: "เลือกประเภทงาน",
        selectCompany: "เลือกบริษัท",
        postJob: "โพสต์งาน",
        posting: "กำลังโพสต์...",
        pleaseRegisterCompany: "กรุณาลงทะเบียนบริษัทก่อนโพส์งาน",
        fillAllFields: "กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง",
        // Add new translations for UpdateJobs
        updateJob: "อัปเดตงาน",
        enterFullname: "กรอกชื่อเต็มของคุณ",
        passwordError: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร",
        confirmPasswordError: "รหัสผ่านไม่ตรงกัน",

        fullnameMinLength: "ชื่อเต็มต้องมีความยาวอย่างน้อย 5 ตัวอักษร",
        fullnameMaxLength: "ชื่อเต็มต้องไม่เกิน 30 ตัวอักษร",
        fullnameOnlyThaiEnglish:
          "กรุณากรอกเฉพาะตัวอักษรภาษาไทยหรืออังกฤษเท่านั้น",
        phoneNumberOnlyDigits: "กรุณากรอกเฉพาะตัวเลขเท่านั้น",

        phoneNumberStartWithZero: "หมายเลขโทรศัพท์ต้องขึ้นต้นด้วย 0",

        invalidEmail: "รูปแบบอีเมลไม่ถูกต้อง",
        passwordRequired: "กรุณากรอกรหัสผ่านของคุณ",
        passwordTooLong: "รหัสผ่านต้องไม่เกิน 30 ตัวอักษร",
        welcomeSubtitle: "ยินดีต้อนรับสู่เว็บไซต์ของเรา",
        password: "รหัสผ่าน",
        enterPassword: "กรอกรหัสผ่าน",
        student: "นักเรียน",
        agent: "ตัวแทน",
        forgotPassword: "ลืมรหัสผ่าน?",
        forgotPassword1: "ลืมรหัสผ่าน",
        dontHaveAccount: "ยังไม่มีบัญชี?",
        createNewAccount: "สร้าง",
        newAccount: "บัญชีใหม่ของคุณ",
        profilePicture: "รูปโปรไฟล์",
        fullnameError:
          "กรุณากรอกชื่อเต็มระหว่าง 5 ถึง 50 ตัวอักษร ห้ามใ้ตัวเลขหรืออักขระพิเศษ",
        phoneNumberError: "กรุณากรอกหมายเลขโทรศัพท์ 8-13 หลัก",
        roleError: "กรุณาเลือกบทบาทของคุณ",
        alreadyHaveAccount: "มีบัญชีอยู่แล้ว?",
        confirmPassword: "ยืนยันรหัสผ่าน",

        enterEmailForReset:
          "กรอกที่อยู่อีเมลของคุณ และเราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านให้คุณ",
        sendResetLink: "ส่งลิงก์รีเซ็ต",
        failedToSendResetEmail: "ไม่สามารถส่งอีเมลรีเซ็ตหัสผ่านไม้",
        emailSentSuccessfully: "ส่งอีเมลสำเร็จแล้ว!",
        pleaseCheckEmail: "กรุณาตรวจสอบอีเมลของคุณเพื่อดำเนินการต่อ",
        redirectingToOTP: "กำลังนำทางไปยังหน้า OTP ใน",
        redirecting: "กำลังนำทาง...",
        enterOTP: "กรอกรหัส OTP",
        otpSentTo: "เราได้ส่งรหัส OTP 7 หลักไปยัง",
        pleaseEnterBelow: "กรุณากรอกรหัสด้านล่าง",
        timeRemaining: "เวลาที่เหลือ",
        verifyOTP: "ยืนยันรหัส OTP",
        resendOTP: "ส่งรหัส OTP อีกครั้ง",
        didntReceiveOTP:
          'ไม่ได้รับรหัส OTP? ตรวจสอบอีเมลขยะหรือคลิก "ส่งรหัส OTP อีกครั้ง"',
        invalidOTP: "รหัส OTP ไม่ถูกต้อง กรุณาลองอีกครั้ง",
        newOTPSent: "ส่งรหัส OTP ใหม่สำเร็จ!",
        failedToResendOTP: "ไม่สามารถส่งรหัส OTP ใหม่ได้",
        pleaseWaitForOTP: "กรุณารอให้รหัส OTP ปัจจุบันหมดอายุก่อนขอรหัสใหม่",
        passwordResetSuccessful: "รีเซ็ตรหัสผ่านสำเร็จ!",
        passwordResetSuccessMessage:
          "รหัสผ่านของคุณด้รับการรีเซ็ตเรียบร้อยแล้ว",
        redirectingToLoginPage: "กำลังนำทางไปยังหน้าเข้าสู่ระบบใน",
        resetPassword: "รีเซ็ตรัสผ่าน",
        enterNewPasswordBelow:
          "กรอกรหัสผ่านใหม่ของคุณด้านล่างเพื่อเข้าถึงบัญชีของคุณอีกครั้ง",
        newPassword: "รหัสผ่านใหม่",
        confirmNewPassword: "ยืนยันรหัสผ่านใหม่",
        passwordLengthCriterion: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร",
        passwordLowercaseCriterion: "รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว",
        passwordUppercaseCriterion: "รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว",
        passwordNumberCriterion: "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว",
        passwordSpecialCharCriterion:
          "รหัสผ่านต้งมีอักขระพิเศษอ่างน้อย 1 ตัว (!@#$%^&*)",
        passwordsDoNotMatch: "รหัสผ่านไม่ตรงกัน",
        verifyYourEmail: "Verify Your Email",
        verificationCodeSentTo: "We've sent a verification code to",
        pleaseEnterCodeBelow: "Please enter the code below.",
        verifyingEmail: "Verifying email...",
        verifyEmail: "Verify Email",
        resendCode: "Resend Code",
        didntReceiveCode:
          'Didn\'t receive the code? Check your spam email or click "Resend Code".',
        youHaveNotAppliedForAnyJobs: "คุณยังไม่ได้สมัครงานใดๆ",
        noLogo: "ไม่มีโลโก้",
        pending: "รอดำเนินการ",
        // Add new translations for Signup
        createAccount: "สร้างบัญชี",
        phoneNumberPlaceholder: "กรอกหมายเลขโทรศัพท์ของคุณ",
        emailPlaceholder: "กรอกอีเมลของคุณ",
        passwordPlaceholder: "กรอกรหัสผ่านของคุณ",
        confirmPasswordPlaceholder: "ยืนยันรหัสผ่านของคุณ",
        selectRole: "เลือกบทบาทของคุณ",
        uploadProfilePicture: "อัปโหลดรูปโปรไฟล์",
        signupButton: "สมัครสมาชิก",
        fillAllFieldsCorrectly: "กรุณากรอกข้อมูลให้ถูกต้อง",
        loginHere: "เข้าสู่ระบบที่นี่",
        fullnameValidation:
          "กรุณากรอกชื่อเต็มของคุณ (5-50 ตัวอักษร ไม่ใช้ตัวเลขหรืออักขระพิเศษ)",
        phoneNumberValidation: "กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง 8-13 หลัก",
        emailValidation: "กรุณากรอกอีเมลที่ถูกต้อง",
        passwordValidation: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร",
        confirmPasswordValidation: "รหัสผ่านไม่ตรงกัน",
        roleValidation: "กรุณาเลือกบทบาท",
        fileValidation: "กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง (PNG, JPG, JPEG)",
        // Add new translations for email validation
        emailEnterEnglish: "กรุณากรอกเป็นภาษาอังกฤษ",
        emailMaxCharacters: "กรุณากรอกไม่เกิน 20 ตัวอักษรก่อน '@'",
        emailValidDomains:
          "กรุณากรอกอีเมลที่ถูกต้อง (ใช้เฉพาะ @gmail.com, @outlook.com, @yahoo.com, หรือ @hotmail.com)",
        // Add new translation for file validation
        fileValidationMessage: "กรุณาเลือกไฟล์ .png .jpeg .jpg เท่านั้น",
        applyConfirmation: "คุณแน่ใจหรือไม่?",
        applyWarning: "คุณจะไม่สามารถยกเลิกการสมัครนี้ได้หลังจากส่งแล้ว!",
        yesApply: "ใช่, สมัคร!",
        notifications: "การแจ้งเตือน",
        newApplicationNotification: "การสมัครงานใหม่",
        jobApplicationNotification: "การสมัครงานของคุณ",

        applyError: "เกิดข้อผิดพลาดขณะสมัครงาน",

        noNotifications: "ไม่มีการแจ้งเตือน",
        unknownJob: "ตำแหน่งงานที่ไม่ระบุ",
        unknownCompany: "บริษัทที่ไม่ระบุ",

        generalNotification: "คุณมีการแจ้งเตือนใหม่",
        deleteNotification: "ลบ",
        youHaveAppliedForTheJob: "คุณได้สมัครงานตำแหน่ง : ",
        newApplicationReceived: "มีผู้สมัครงานใหม่สำหรับตำแหน่งงาน : ",
        yourApplicationStatusUpdated: "สถานะการสมัครของคุณถูกอัปเดตเป็น : ",
        applicationAccepted: "คุณได้รับการสมัครงานตำแหน่ง : ",
        applicationRejected: "คุณไม่ได้รับการสมัครงานตำแหน่ง : ",
        atCompany: "ที่บริษัท",
        updated: "อัปเดต",
        yourApplicationFor: "ในการสมัครของคุณสำหรับตำแหน่ง",
        positionHasBeen: "ถูก",
        notificationDeleted: "การแจ้งเตือนถูกลบเรียบร้อย",
        errorDeletingNotification: "เกิดข้อผิดพลาดในการลบการแจ้งเตือน",
        on: "เมื่อ",
        unknownDate: "ไม่ทราบวันที่",
        allNotificationsMarkedAsRead: "ทำเครื่องหมายว่าอ่านแล้วทั้งหมด",
        errorMarkingNotificationsAsRead:
          "เกิดข้อผิดพลาดในการทำเครื่องหมายว่าอ่านแล้ว",
        markAllAsRead: "อ่านทั้งหมด",
        nameUpdatedSuccessfully: "อัปเดตชื่อสำเร็จ",
        errorUpdatingName: "เกิดข้อผิดพลาดในการอัปเดตชื่อ",
        updateProfileTitle: "อัปเดตโปรไฟล์",
        uploadNewPhoto: "อัปโหลดรูปใหม่",
        removePhoto: "ลบรูปภาพ",
        uploadResume: "อัปโหลดเรซูเม่",
        removeResume: "ลบเรซูเม่",
        bioPlaceholder: "เลือกประวัติย่อของคุณ (สูงสุด 3 รายการ)",
        skillsPlaceholder: "เลือกทักษะของคุณ",
        // Validation messages
        fullnameTooShort: "กรุณากรอกอย่างน้อย 5 ตัวอักษร",
        fullnameTooLong: "กรอกได้สูงสุด 30 ตัวอักษร",
        fullnameInvalidChars: "กรุณากรอกภาษาไทยหรือภาษาอังกฤษเท่านั้น",
        phoneInvalidDigits: "กรุณากรอกตัวเลขเท่านั้น",
        phoneInvalidLength: "หมายเลขโทรศัพท์ต้องมี 10 หลัก",
        phoneStartWithZero: "หมายเลขโทรศัพท์ต้องขึ้นต้นด้วย 0",
        phoneAlreadyInUse: "หมายเลขโทรศัพท์นี้ถูกใช้งานแล้ว",
        // Success messages
        profileUpdateSuccess: "อัปเดตโปรไฟล์สำเร็จ",
        // Error messages
        bioMaxSelection: "ไม่สามารถเลือกประวัติย่อได้มากกว่า 3 รายการ",
        
        fileTypeError: "กรุณาเลือกไฟล์ PNG, JPG หรือ JPEG เท่านั้น",
      },
    },
  },
  lng: savedLanguage, // ใช้ภาษาที่บันทึกไว้แทน 'en'
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// เพิ่มฟังก์ชันนี้เพื่อเปลี่ยนภาษาและบันทึกลงใน localStorage
export const changeLanguage = (lang) => {
  i18n.changeLanguage(lang);
  localStorage.setItem("language", lang);
};

export default i18n;
