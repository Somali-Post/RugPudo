import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import styles from './VerifyPhoneNumberScreen.module.css';

const content = {
  English: {
    title: 'Verify Phone Number',
    heading: 'Enter Verification Code',
    subheading: 'We sent a 6-digit code to',
    verifyButton: 'Verify',
    noCode: "Didn't receive the code?",
    resend: 'Resend code',
    resendInProgress: 'Resend code in',
    seconds: 'seconds',
  },
  Somali: {
    title: 'Xaqiiji Nambarka Taleefanka',
    heading: 'Geli Koodka Xaqiijinta',
    subheading: 'Waxaan u dirnay kood 6-dijit ah',
    verifyButton: 'Xaqiiji',
    noCode: 'Koodka ma helin?',
    resend: 'Koodka dib u dir',
    resendInProgress: 'Koodka dib u dir',
    seconds: 'ilbiriqsi',
  },
};

const MOCK_PHONE_NUMBER = '+252 612345XXX';
const OTP_LENGTH = 6;

const VerifyPhoneNumberScreen = () => {
  const { language, user, login } = useAppContext();
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const pendingUser = location.state?.pendingUser || null;

  const currentContent = content[language] || content.English;

  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const handleResendCode = async () => {
    if (countdown > 0) return;
    setError('');
    try {
      const phone = ((pendingUser?.phone || user?.phone) || '').replace(/\s+/g, '');
      if (!phone) throw new Error('Missing phone number to resend code.');
      // Frontend-only mock: pretend code is sent and restart timer
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

  const otpBoxes = Array(OTP_LENGTH)
    .fill(0)
    .map((_, index) => (
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
      // Frontend-only mock: accept any 6-digit OTP
      const phoneRaw = (pendingUser?.phone || user?.phone || '').replace(/\s+/g, '');
      const fullName = pendingUser?.name || 'Local User';
      const id = `local-${phoneRaw || Math.random().toString(36).slice(2)}`;
      const profile = { id, full_name: fullName, phone: phoneRaw };

      login(profile, null);
      navigate('/select-pudo/list', { replace: true });
    } catch (err) {
      console.error('Verification Error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/')}>←</button>
        <h1 className={styles.headerTitle}>{currentContent.title}</h1>
        <div className={styles.backButtonPlaceholder} />
      </header>

      <main className={styles.contentContainer}>
        <div className={styles.introBlock}>
          <h2 className={styles.heading}>{currentContent.heading}</h2>
          <p className={styles.subheading}>
            {currentContent.subheading} {pendingUser?.phone || user?.phone || MOCK_PHONE_NUMBER}
          </p>
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
          <p className={styles.resendTimerText} style={{ color: '#d32f2f' }}>
            {error}
          </p>
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
    </div>
  );
};

export default VerifyPhoneNumberScreen;

