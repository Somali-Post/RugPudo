import React, { useState, useEffect, useRef } from 'react';
import styles from './VerifyPhoneNumberScreen.module.css';

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
  const [language, setLanguage] = useState('English');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputRef = useRef(null);

  const currentContent = content[language];

  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendCode = () => {
    if (countdown === 0) {
      setCountdown(60);
      // TODO: Add logic to resend code
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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton}>‹</button>
        <h1 className={styles.headerTitle}>{currentContent.title}</h1>
        <div className={styles.backButtonPlaceholder} />
      </header>

      <main className={styles.contentContainer}>
        <div className={styles.introBlock}>
          <h2 className={styles.heading}>{currentContent.heading}</h2>
          <p className={styles.subheading}>{currentContent.subheading} {MOCK_PHONE_NUMBER}</p>
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

        <a href="/select-pudo" className={`${styles.verifyButton} ${otp.length < OTP_LENGTH ? styles.disabledButton : ''}`} style={{ textDecoration: 'none' }}>
          {currentContent.verifyButton}
        </a>

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