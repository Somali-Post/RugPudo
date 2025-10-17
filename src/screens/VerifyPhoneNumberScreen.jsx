import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import styles from './VerifyPhoneNumberScreen.module.css';
import { auth } from '../firebase/config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { supabase } from '../supabase/client';

const content = {
  English: {
    title: "Verify Phone Number",
    heading: "Enter Verification Code",
    subheading: "We sent a 6-digit code to",
    verifyButton: "Verify",
    noCode: "Didn’t receive the code?",
    resend: "Resend code",
    resendInProgress: "Resend code in",
    seconds: "seconds"
  },
  Somali: {
    title: "Xaqiiji Nambarka Taleefanka",
    heading: "Geli Koodka Xaqiijinta",
    subheading: "Waxaan u dirnay kood 6-dijit ah",
    verifyButton: "Xaqiiji",
    noCode: "Koodka ma helin?",
    resend: "Koodka dib u dir",
    resendInProgress: "Koodka dib u dir",
    seconds: "ilbiriqsi"
  }
};

const MOCK_PHONE_NUMBER = "+252 612345XXX";
const OTP_LENGTH = 6;

const VerifyPhoneNumberScreen = () => {
  const language = 'English';
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { pudo, user, login } = useAppContext();
  const pendingUser = location.state?.pendingUser || null;

  const currentContent = content[language];

  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const setupRecaptcha = useCallback((containerId) => {
    try {
      return new RecaptchaVerifier(
        auth,
        containerId,
        {
          size: 'invisible',
          callback: () => {},
          'expired-callback': () => {},
        }
      );
    } catch (_) {
      try {
        return new RecaptchaVerifier(containerId, { size: 'invisible' }, auth);
      } catch (e) {
        console.error('Failed to initialize reCAPTCHA', e);
        return null;
      }
    }
  }, []);

  const handleResendCode = async () => {
    if (countdown > 0) return;
    setError('');
    try {
      const phone = ((pendingUser?.phone || user?.phone) || '').replace(/\s+/g, '');
      if (!phone) throw new Error('Missing phone number to resend code.');
      const verifier = setupRecaptcha('recaptcha-container-verify');
      if (!verifier) throw new Error('Failed to initialize reCAPTCHA');
      window.confirmationResult = await signInWithPhoneNumber(auth, phone, verifier);
      setCountdown(60);
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to resend verification code.');
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setOtp(value);
  };

  const otpBoxes = Array(OTP_LENGTH).fill(0).map((_, index) => (
    <div key={index} className={`${styles.otpBox} ${otp.length === index ? styles.otpBoxFocused : ''}`}>
      {otp[index] || ''}
    </div>
  ));

const handleVerifyOtp = async (e) => {
  e.preventDefault();
  if (otp.length !== 6) return;

  setVerifying(true);
  setError('');
  
  try {
    const confirmationResult = window.confirmationResult;
    if (!confirmationResult) throw new Error('Verification session expired.');

    // 1. Confirm OTP with Firebase to get the user and token
    const result = await confirmationResult.confirm(otp);
    const firebaseUser = result.user;
    const firebaseToken = await firebaseUser.getIdToken();

    // 2. CRITICAL STEP: Call our Edge Function with the token
    const { data, error: functionError } = await supabase.functions.invoke('provision-firebase-user', {
      body: { token: firebaseToken }
    });

    if (functionError) throw functionError;

    // The Edge function returns the Supabase user. Now we need to set the session on the client.
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
    });
    if (sessionError) throw sessionError;


    // 3. Fetch the user's profile from the database
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionData.user.id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // 4. Update the user's name in the profile
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ full_name: pendingUser?.name || 'New User' })
        .eq('id', sessionData.user.id);

    if (updateError) throw updateError;


    // 5. Log the user into the app's context
    login({ ...profile, full_name: pendingUser?.name || 'New User' }, null);
    navigate('/select-pudo/list', { replace: true });

  } catch (err) {
    console.error("Verification Error:", err);
    setError(err.message || 'An error occurred. Please try again.');
  } finally {
    setVerifying(false);
  }
};

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/')}>‹</button>
        <h1 className={styles.headerTitle}>{currentContent.title}</h1>
        <div className={styles.backButtonPlaceholder} />
      </header>

      <main className={styles.contentContainer}>
        <div className={styles.introBlock}>
          <h2 className={styles.heading}>{currentContent.heading}</h2>
          <p className={styles.subheading}>{currentContent.subheading} { (pendingUser?.phone || (user && user.phone) || MOCK_PHONE_NUMBER) }</p>
        </div>

        <div className={styles.otpContainer}>
          {otpBoxes}
          <input
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            autoComplete="one-time-code"
            className={styles.hiddenInput}
            value={otp}
            onChange={handleOtpChange}
            maxLength={OTP_LENGTH}
          />
        </div>

        {error ? (
          <p className={styles.resendTimerText} style={{ color: '#d32f2f' }}>{error}</p>
        ) : null}

        <button
          className={`${styles.verifyButton} ${otp.length < OTP_LENGTH || verifying ? styles.disabledButton : ''}`}
          disabled={otp.length < OTP_LENGTH || verifying}
          onClick={handleVerifyOtp}
        >
          {verifying ? 'Verifying…' : currentContent.verifyButton}
        </button>

        <div className={styles.resendArea}>
          <p className={styles.resendInfoText}>{currentContent.noCode}</p>
          {countdown > 0 ? (
            <p className={styles.resendTimerText}>
              {currentContent.resendInProgress} {countdown} {currentContent.seconds}
            </p>
          ) : (
            <button onClick={handleResendCode} className={styles.resendLink}>
              {currentContent.resend}
            </button>
          )}
        </div>
      </main>
      {/* reCAPTCHA container for resends */}
      <div id="recaptcha-container-verify" style={{ display: 'none' }} />
    </div>
  );
};

export default VerifyPhoneNumberScreen;
