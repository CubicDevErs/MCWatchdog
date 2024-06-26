import { getAuth, sendEmailVerification } from "firebase/auth";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { app } from "../Firebase";

export const initializeFirebaseUI = (containerId) => {
  console.log("Initializing FirebaseUI...");

  const auth = getAuth(app);
  const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

  ui.start(containerId, {
    signInSuccessUrl: "/#/dashboard",
    signInOptions: [
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        clientId: "606031045534-74p4nprdtduh06gtgqkf1b8n411cg9s1.apps.googleusercontent.com",
      },
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: true,
        signInMethod: firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
      },
    ],
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInFlow: "popup",
    callbacks: {
      signInSuccessWithAuthResult: async function (authResult, redirectUrl) {

        const user = authResult.user;
        if (!user.emailVerified) {
          try {
            await sendEmailVerification(user);
          } catch (error) {
            console.error("Error sending email verification:", error);
          }
        }
        return true; 
      },
      signInFailure: function (error) {
        console.error("Sign-in failure:", error);
        handleSignInFailure(error);
      },
    },
  });

  ui.disableAutoSignIn(); 
};

function handleSignInFailure(error) {
  if (error.code === "firebaseui/anonymous-upgrade-merge-conflict") {
    console.log("Merge conflict error:", error);
  } else {
    console.log("Error during sign-in:", error);
  }
}