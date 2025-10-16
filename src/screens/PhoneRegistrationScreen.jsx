import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/shared';
import styles from './PhoneRegistrationScreen.module.css';
import { auth } from '../firebase/config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { supabase } from '../supabase/client';

const content = {
  English: {
    loginTitle: "Login to Rug",
    registerTitle: "Create Account",
    subheading: "Connect your phone number to your nearest pickup point",
    fullNameLabel: "Full Name",
    phoneLabel: "Enter your Somali phone number",
    helperText: "Format: 6xxxxxxxx (9 digits)",
    loginButton: "Login",
    registerButton: "Register",
    loginPrompt: "Don't have an account?",
    loginAction: "Register",
    registerPrompt: "Already have an account?",
    registerAction: "Login",
    footer: "By continuing, you agree to our",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
  },
  Somali: {
    loginTitle: "Soo Gal Rug",
    registerTitle: "Samee Akoon",
    subheading: "Ku xidh nambarkaaga taleefanka goobta kuugu dhow",
    fullNameLabel: "Magaca oo Dhamaystiran",
    phoneLabel: "Geli nambarkaaga Soomaaliga ah",
    helperText: "Qaabka: 6xxxxxxxx (9 lambar)",
    loginButton: "Soo Gal",
    registerButton: "Isdiiwaangeli",
    loginPrompt: "Akoon ma lihid?",
    loginAction: "Isdiiwaangeli",
    registerPrompt: "Akoon ma leedahay?",
    registerAction: "Soo Gal",
    footer: "Markaad sii wadato, waxaad ogolaatay",
    terms: "Shuruudaha Adeegga",
    privacy: "Qaanuunka Arrimaha Khaaska ah",
  }
};

const PhoneRegistrationScreen = () => {
  const [mode, setMode] = useState('Login');
  const [language, setLanguage] = useState('English');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const currentContent = content[language];
  const isLoginMode = mode === 'Login';
  const isPhoneValid = useMemo(() => /^6\d{8}$/.test(phoneNumber), [phoneNumber]);
  const isNameValid = useMemo(() => fullName.trim().length >= 2, [fullName]);
  const canContinue = isLoginMode ? isPhoneValid : (isPhoneValid && isNameValid);

  const setupRecaptcha = useCallback(() => {
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          'recaptcha-container',
          {
            size: 'invisible',
            callback: () => {
              // reCAPTCHA solved - will proceed with sign-in
            },
            'expired-callback': () => {
              // Reset so we can render a fresh instance next time
              try { window.recaptchaVerifier.clear(); } catch {}
              window.recaptchaVerifier = null;
            },
          }
        );
      } catch (e) {
        // If constructor signature differs (SDK version), try alternate signature
        try {
          window.recaptchaVerifier = new RecaptchaVerifier(
            'recaptcha-container',
            { size: 'invisible' },
            auth
          );
        } catch (err) {
          console.error('Failed to initialize reCAPTCHA', err);
        }
      }
    }
    return window.recaptchaVerifier;
  }, []);

  const handleSendOtp = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    setSending(true);
    try {
      const e164Phone = `+252${phoneNumber}`.replace(/\s+/g, '');

      // Supabase existence check before sending OTP
      try {
const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', e164Phone)
      .maybeSingle();

    if (isLoginMode && !existingProfile) {
      showToast('Login Failed', 'No account found with this phone number. Please register.');
      setSending(false);
      return;
    }
    if (!isLoginMode && existingProfile) {
      showToast('Registration Failed', 'An account with this phone number already exists. Please log in.');
      setSending(false);
      return;
    }
        if (fetchError) {
          console.warn('Supabase user lookup warning:', fetchError);
        }
      } catch (lookupErr) {
        console.warn('Supabase lookup failed; proceeding with OTP anyway.', lookupErr);
      }

      const verifier = setupRecaptcha();
      if (!verifier) throw new Error('Failed to initialize reCAPTCHA');
      const confirmationResult = await signInWithPhoneNumber(auth, e164Phone, verifier);
      window.confirmationResult = confirmationResult;
      // Pass pending user to Verify screen; finalize after OTP confirmation
      navigate('/verify', { replace: true, state: { pendingUser: { name: fullName.trim() || '', phone: `+252 ${phoneNumber}` } } });
    } catch (err) {
      console.error(err);
      showToast('Error', err?.message || 'Failed to send verification code.');
      try {
        // Clear to allow retry
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }
      } catch {}
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <img src="/assets/images/logo-wordmark.png" alt="Rug Logo" className={styles.logo} />
        <h1 className={styles.mainHeading}>
          {isLoginMode ? currentContent.loginTitle : currentContent.registerTitle}
        </h1>
        <p className={styles.subheading}>{currentContent.subheading}</p>

        <div className={styles.languageToggle}>
          <button
            className={`${styles.toggleButton} ${language === 'Somali' ? styles.activeButton : ''}`}
            onClick={() => setLanguage('Somali')}
          >
            Somali
          </button>
          <button
            className={`${styles.toggleButton} ${language === 'English' ? styles.activeButton : ''}`}
            onClick={() => setLanguage('English')}
          >
            English
          </button>
        </div>

        <div className={styles.inputSection}>
          {!isLoginMode && (
            <div className={styles.fieldGroup}>
              <label className={styles.inputLabel}>{currentContent.fullNameLabel}</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Abdi Gaal"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.inputLabel}>{currentContent.phoneLabel}</label>
            <div className={styles.inputContainer}>
              <span className={styles.prefix}>+252</span>
              <input
                type="tel"
                className={styles.input}
                placeholder="6xxxxxxxx"
                maxLength={9}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <p className={styles.helperText}>{currentContent.helperText}</p>
          </div>
        </div>

        <button
          className={styles.primaryButton}
          disabled={!canContinue || sending}
          onClick={handleSendOtp}
        >
          {sending ? 'Sending…' : (isLoginMode ? currentContent.loginButton : currentContent.registerButton)}
        </button>

        <p className={styles.toggleModeText}>
          {isLoginMode ? currentContent.loginPrompt : currentContent.registerPrompt}{' '}
          <button className={styles.toggleModeLink} onClick={() => setMode(isLoginMode ? 'Register' : 'Login')}>
            {isLoginMode ? currentContent.loginAction : currentContent.registerAction}
          </button>
        </p>
      </main>

      <footer className={styles.footer}>
        {currentContent.footer}{' '}
        <Link to="/terms" className={styles.linkText}>{currentContent.terms}</Link> and{' '}
        <Link to="/privacy" className={styles.linkText}>{currentContent.privacy}</Link>.
      </footer>
      {/* reCAPTCHA container (invisible) */}
      <div id="recaptcha-container" style={{ display: 'none' }} />
    </div>
  );
};

export default PhoneRegistrationScreen;
