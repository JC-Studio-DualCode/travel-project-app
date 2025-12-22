import styles from "./LoginModal.module.css";
import { useAuth } from "./AuthContext";

function LoginModal({ onClose }) {
  const { loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    await loginWithGoogle();
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>✕</button>

        <h2>Welcome to CITYVERSE</h2>
        <p>Sign in to share your city experiences</p>

        <button className={styles.googleBtn} onClick={handleLogin}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default LoginModal;