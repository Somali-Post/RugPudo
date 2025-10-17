import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './PhoneRegistrationScreen.module.css';

export default function PhoneRegistrationScreen() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleContinue = (e) => {
    e.preventDefault();
    setError('');
    const phoneNormalized = phone.replace(/\s+/g, '');
    if (!fullName || !phoneNormalized) {
      setError('Please enter your full name and phone number.');
      return;
    }
    navigate('/verify', { state: { pendingUser: { name: fullName, phone: phoneNormalized } } });
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <h1 className={styles.mainHeading}>Log in to Rug</h1>
        <p className={styles.subheading}>Create account or continue with your phone.</p>

        <form className={styles.inputSection} onSubmit={handleContinue}>
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
        </form>

        <div className={styles.footer}>
          <Link className={styles.linkText} to="/terms">Terms</Link>
          {' · '}
          <Link className={styles.linkText} to="/privacy">Privacy</Link>
        </div>
      </div>
    </div>
  );
}

