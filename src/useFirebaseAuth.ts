import {
  onAuthStateChanged,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  sendEmailVerification,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { AuthError } from './constants/auth';

const useFirebaseAuth = () => {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // console.log('user from authState listener', user);
      setCurrentUser(user);
      setIsEmailVerified(Boolean(user?.emailVerified));
    });

    return unsubscribe;
  }, [auth]);

  const sendVerificationEmail = async (user: User) => {
    try {
      await sendEmailVerification(user);
      // console.log('Verification email sent to:', user.email);
    } catch (error) {
      console.error('Error sending verification email:', error);
      // Handle error appropriately (e.g., display message to user)
    }
  };

  const signupWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        sendVerificationEmail(user);
      })
      .catch((error) => {
        const { code, message } = error;
        setAuthError({ code, message });
      });
  };

  const signinWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return user;
      })
      .catch((error) => {
        const { code, message } = error;
        setAuthError({ code, message });
      });
  };

  const checkEmailVerificationStatus = () => {
    currentUser?.reload().then(() => {
      if (currentUser?.emailVerified) {
        setIsEmailVerified(true);
      }
    });
  };

  const logout = async () => {
    signOut(auth);
  };

  return {
    currentUser,
    isEmailVerified,
    authError,
    signupWithEmailAndPassword,
    signinWithEmailAndPassword,
    checkEmailVerificationStatus,
    logout,
  };
};

export default useFirebaseAuth;
