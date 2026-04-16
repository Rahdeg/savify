const { User } = require("../models/user");
const { Auth } = require("../models/auth");

exports.showRegister = (req, res) => {
  res.render("register", { title: "Register" });
};

exports.showLogin = (req, res) => {
  res.render("login", {
    title: "Login",
    info: req.query?.message || "",
  });
};

exports.showVerifyEmail = (req, res) => {
  const email = (req.query?.email || "").trim().toLowerCase();
  return res.render("verify-email", {
    title: "Verify Email",
    email,
    error: req.query?.error || "",
    info: req.query?.info || "",
  });
};

exports.register = async (req, res) => {
  try {
    const email = (req.body?.email || "").trim().toLowerCase();
    const password = req.body?.password || "";
    const confirmPassword = req.body?.confirm_password || "";
    const fullName = (req.body?.full_name || "").trim();
    const occupation = (req.body?.occupation || "").trim() || null;

    if (!email || !password) {
      return res.render("register", {
        title: "Register",
        error: "Email and password are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.render("register", {
        title: "Register",
        error: "Passwords do not match.",
      });
    }

    const user = new User(email);
    const wasAdded = await user.addUser(password, fullName || null, occupation);

    if (!wasAdded) {
      return res.render("register", {
        title: "Register",
        error: "Email is already registered.",
      });
    }

    try {
      await Auth.createEmailVerification(user.user_id, email);
    } catch (sendErr) {
      return res.render("verify-email", {
        title: "Verify Email",
        email,
        error:
          "Account created, but we could not send OTP right now. Please click resend.",
      });
    }

    return res.redirect(`/auth/verify?email=${encodeURIComponent(email)}`);
  } catch (err) {
    return res.render("register", {
      title: "Register",
      error: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const email = (req.body?.email || "").trim().toLowerCase();
    const password = req.body?.password || "";

    if (!email || !password) {
      return res.render("login", {
        title: "Login",
        error: "Email and password are required.",
      });
    }

    const auth = new Auth(email);
    const authResult = await auth.login(password);

    if (!authResult.ok && authResult.reason === "email_not_verified") {
      try {
        await Auth.resendOtp(email);
      } catch (err) {
        // Ignore resend errors here; user can still request resend on verify page.
      }
      return res.redirect(
        `/auth/verify?email=${encodeURIComponent(email)}&info=${encodeURIComponent("We sent a verification code to your email.")}`,
      );
    }

    if (!authResult.ok) {
      return res.render("login", {
        title: "Login",
        error: "Invalid email or password.",
      });
    }

    const user = authResult;

    if (user) {
      req.session.user = {
        user_id: user.user_id,
        // user_id: "3", // this is a temporary hardcoded value for testing until we implement dynamic session user assignment on login
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        isVerified: user.is_verified,
      };
      req.session.loggedIn = true;
    }

    // OPTIONAL: examine the session in the console
    console.log(req.session, "Session after login");

    return res.redirect("/dashboard");
  } catch (err) {
    return res.render("login", {
      title: "Login",
      error: err.message,
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const email = (req.body?.email || "").trim().toLowerCase();
    const otp = (
      req.body?.otp ||
      `${req.body?.otp1 || ""}${req.body?.otp2 || ""}${req.body?.otp3 || ""}${req.body?.otp4 || ""}`
    ).trim();

    if (!email || !otp) {
      return res.render("verify-email", {
        title: "Verify Email",
        email,
        error: "Email and OTP are required.",
      });
    }

    const result = await Auth.verifyOtp(email, otp);
    if (!result.ok) {
      const map = {
        user_not_found: "User not found.",
        otp_not_found: "No OTP found. Please request a new code.",
        otp_expired: "OTP has expired. Please request a new code.",
        invalid_otp: "Invalid OTP. Please try again.",
      };

      return res.render("verify-email", {
        title: "Verify Email",
        email,
        error: map[result.reason] || "Unable to verify email.",
      });
    }

    return res.redirect(
      `/auth/login?message=${encodeURIComponent("Email verified successfully. Please login.")}`,
    );
  } catch (err) {
    return res.render("verify-email", {
      title: "Verify Email",
      email: (req.body?.email || "").trim().toLowerCase(),
      error: err.message,
    });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const email = (req.body?.email || "").trim().toLowerCase();
    if (!email) {
      return res.render("verify-email", {
        title: "Verify Email",
        email,
        error: "Email is required.",
      });
    }

    const result = await Auth.resendOtp(email);
    if (!result.ok && result.reason === "already_verified") {
      return res.redirect(
        `/auth/login?message=${encodeURIComponent("Email already verified. Please login.")}`,
      );
    }

    if (!result.ok) {
      return res.render("verify-email", {
        title: "Verify Email",
        email,
        error: "Unable to resend OTP.",
      });
    }

    return res.render("verify-email", {
      title: "Verify Email",
      email,
      info: "A new OTP has been sent to your email.",
    });
  } catch (err) {
    console.error("Resend OTP failed:", err.message);
    return res.render("verify-email", {
      title: "Verify Email",
      email: (req.body?.email || "").trim().toLowerCase(),
      error: "Could not send OTP right now. Please try again.",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    await Auth.logout(req.session);
    res.clearCookie("connect.sid");
    return res.redirect("/auth/login");
  } catch (err) {
    return res.render("login", {
      title: "Login",
      error: "Unable to logout. Please try again.",
    });
  }
};
