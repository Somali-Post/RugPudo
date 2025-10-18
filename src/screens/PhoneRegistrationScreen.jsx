import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './PhoneRegistrationScreen.module.css';
import { useAppContext } from '../context/shared';

const content = {
  English: {
    loginTitle: 'Log in to Rug',
    registerTitle: 'Create your Rug account',
    loginSubheading: 'Continue with your phone number.',
    registerSubheading: 'Enter your details to get started.',
    fullName: 'Full name',
    yourName: 'Your name',
    phoneNumber: 'Phone number',
    phonePlaceholder: '61 234 5678',
    helper: "We'll send a 6-digit code to verify.",
    continue: 'Continue',
    terms: 'Terms',
    privacy: 'Privacy Policy',
    dontHaveAccount: "Don't have an account?",
    createOne: 'Create one',
    alreadyHave: 'Already have an account?',
    login: 'Log in',
    byContinuing: 'By continuing, you agree to our',
    and: 'and',
    fullNameRequired: 'Full name is required.',
    phoneRequired: 'Please enter your phone number.',
  },
  Somali: {
    loginTitle: 'Gali Rug',
    registerTitle: 'Abuur akoonkaaga Rug',
    loginSubheading: 'Sii wad adigoo isticmaalaya lambarka taleefanka.',
    registerSubheading: 'Geli faahfaahintaada si aad u bilowdo.',
    fullName: 'Magaca oo buuxa',
    yourName: 'Magacaaga',
    phoneNumber: 'Lambarka taleefanka',
    phonePlaceholder: '61 234 5678',
    helper: 'Waxaan kuu soo diri doonnaa kood 6-dijit ah si loo xaqiijiyo.',
    continue: 'Sii wad',
    terms: 'Shuruudaha',
    privacy: 'Qaanuunka Arrimaha Khaaska ah',
    dontHaveAccount: 'Xisaab ma lihid?',
    createOne: 'Abuur mid',
    alreadyHave: 'Horey baad u leedahay xisaab?',
    login: 'Gali',
    byContinuing: 'Adigoo sii wadda, waxaad oggolaatay',
    and: 'iyo',
    fullNameRequired: 'Magaca oo buuxa waa lama huraan.',
    phoneRequired: 'Fadlan geli lambarka taleefanka.',
  },
};

export default function PhoneRegistrationScreen() {
  const navigate = useNavigate();
  const { language, setLanguage } = useAppContext();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true); // two states: login and register
  const c = content[language] || content.English;

  const handleContinue = (e) => {
    e.preventDefault();
    setError('');

    const phoneNormalized = phone.replace(/\s+/g, '');
    if (!phoneNormalized) {
      setError(c.phoneRequired);
      return;
    }
    if (!isLogin && !fullName) {
      setError(c.fullNameRequired);
      return;
    }

    const pendingUser = { name: isLogin ? 'User' : fullName, phone: phoneNormalized };
    navigate('/verify', { state: { pendingUser } });
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <img src="/assets/images/logo-wordmark.png" alt="Rug" className={styles.logo} />
        <div className={styles.languageToggle}>
          <button
            type="button"
            className={`${styles.toggleButton} ${language === 'English' ? styles.activeButton : ''}`}
            onClick={() => setLanguage('English')}
          >
            English
          </button>
          <button
            type="button"
            className={`${styles.toggleButton} ${language === 'Somali' ? styles.activeButton : ''}`}
            onClick={() => setLanguage('Somali')}
          >
            Somali
          </button>
        </div>
        <h1 className={styles.mainHeading}>{isLogin ? c.loginTitle : c.registerTitle}</h1>
        <p className={styles.subheading}>{isLogin ? c.loginSubheading : c.registerSubheading}</p>

        <form className={styles.inputSection} onSubmit={handleContinue}>
          {!isLogin && (
            <div className={styles.fieldGroup}>
              <label className={styles.inputLabel}>{c.fullName}</label>
              <div className={styles.inputContainer}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder={c.yourName}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.inputLabel}>{c.phoneNumber}</label>
            <div className={styles.inputContainer}>
              <span className={styles.prefix}>+252</span>
              <input
                className={styles.input}
                type="tel"
                inputMode="tel"
                placeholder={c.phonePlaceholder}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className={styles.helperText}>{c.helper}</div>
          </div>

          {error ? (
            <div className={styles.helperText} style={{ color: '#d32f2f' }}>{error}</div>
          ) : null}

          <button className={styles.primaryButton} type="submit">{c.continue}</button>

          <p className={styles.helperText} style={{ marginTop: 10 }}>
            {c.byContinuing} <Link className={styles.linkText} to="/terms">{c.terms}</Link> {c.and}{' '}
            <Link className={styles.linkText} to="/privacy">{c.privacy}</Link>.
          </p>
        </form>

        <p className={styles.toggleModeText}>
          {isLogin ? (
            <>
              {c.dontHaveAccount}{' '}
              <button type="button" className={styles.toggleModeLink} onClick={() => setIsLogin(false)}>{c.createOne}</button>
            </>
          ) : (
            <>
              {c.alreadyHave}{' '}
              <button type="button" className={styles.toggleModeLink} onClick={() => setIsLogin(true)}>{c.login}</button>
            </>
          )}
        </p>

        <div className={styles.footer}>
          <Link className={styles.linkText} to="/terms">{c.terms}</Link>
          {' • '}
          <Link className={styles.linkText} to="/privacy">{c.privacy}</Link>
        </div>
      </div>
    </div>
  );
}

