import React, { useState } from 'react';
import styles from './PhoneRegistrationScreen.module.css';

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

  const currentContent = content[language];
  const isLoginMode = mode === 'Login';

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

        <a href="/verify" className={styles.primaryButton} style={{ textDecoration: 'none' }}>
          {isLoginMode ? currentContent.loginButton : currentContent.registerButton}
        </a>

        <p className={styles.toggleModeText}>
          {isLoginMode ? currentContent.loginPrompt : currentContent.registerPrompt}{' '}
          <button className={styles.toggleModeLink} onClick={() => setMode(isLoginMode ? 'Register' : 'Login')}>
            {isLoginMode ? currentContent.loginAction : currentContent.registerAction}
          </button>
        </p>
      </main>

      <footer className={styles.footer}>
        {currentContent.footer}{' '}
        <a href="#" className={styles.linkText}>{currentContent.terms}</a> and{' '}
        <a href="#" className={styles.linkText}>{currentContent.privacy}</a>.
      </footer>
    </div>
  );
};

export default PhoneRegistrationScreen;