import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './PhoneRegistrationScreen.module.css';

export default function PhoneRegistrationScreen() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true); // two states: login and register

  const handleContinue = (e) => {
    e.preventDefault();
    setError('');

    const phoneNormalized = phone.replace(/\s+/g, '');
    if (!phoneNormalized) {
      setError('Please enter your phone number.');
      return;
    }
    if (!isLogin && !fullName) {
      setError('Please enter your full name.');
      return;
    }

    const pendingUser = { name: isLogin ? 'User' : fullName, phone: phoneNormalized };
    navigate('/verify', { state: { pendingUser } });
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <img src="/assets/images/logo-wordmark.png" alt="Rug" className={styles.logo} />
        <h1 className={styles.mainHeading}>{isLogin ? 'Log in to Rug' : 'Create your Rug account'}</h1>
        <p className={styles.subheading}>
          {isLogin ? 'Continue with your phone number.' : 'Enter your details to get started.'}
        </p>

        <form className={styles.inputSection} onSubmit={handleContinue}>
          {!isLogin && (
            <div className={styles.fieldGroup}>
              <label className={styles.inputLabel}>Full name</label>
              <div className={styles.inputContainer}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.inputLabel}>Phone number</label>
            <div className={styles.inputContainer}>
              <span className={styles.prefix}>+252</span>
              <input
                className={styles.input}
                type="tel"
                inputMode="tel"
                placeholder="61 234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className={styles.helperText}>We’ll send a 6‑digit code to verify.</div>
          </div>

          {error ? (
            <div className={styles.helperText} style={{ color: '#d32f2f' }}>{error}</div>
          ) : null}

          <button className={styles.primaryButton} type="submit">Continue</button>

          <p className={styles.helperText} style={{ marginTop: 10 }}>
            By continuing, you agree to our{' '}
            <Link className={styles.linkText} to="/terms">Terms</Link>{' '}and{' '}
            <Link className={styles.linkText} to="/privacy">Privacy Policy</Link>.
          </p>
        </form>

        <p className={styles.toggleModeText}>
          {isLogin ? (
            <>
              Don’t have an account?{' '}
              <button type="button" className={styles.toggleModeLink} onClick={() => setIsLogin(false)}>Create one</button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" className={styles.toggleModeLink} onClick={() => setIsLogin(true)}>Log in</button>
            </>
          )}
        </p>

        <div className={styles.footer}>
          <Link className={styles.linkText} to="/terms">Terms</Link>
          {' · '}
          <Link className={styles.linkText} to="/privacy">Privacy</Link>
        </div>
      </div>
    </div>
  );
}
