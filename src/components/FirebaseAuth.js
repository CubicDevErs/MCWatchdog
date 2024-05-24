import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { app } from "../Firebase";

export const initializeFirebaseUI = (containerId) => {
  console.log("Initializing FirebaseUI...");

  const ui =
    firebaseui.auth.AuthUI.getInstance() ||
    new firebaseui.auth.AuthUI(getAuth(app));

  console.log("Starting FirebaseUI...");

  const actionCodeSettings = {
    url: "https://mcwatchdog.com",
    handleCodeInApp: true,
  };

  ui.start(containerId, {
    signInSuccessUrl: "/#/dashboard",
    signInOptions: [
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        clientId: "606031045534-74p4nprdtduh06gtgqkf1b8n411cg9s1.apps.googleusercontent.com",
      },
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        requireDisplayName: true,
        actionCodeSettings: actionCodeSettings,
      },
    ],
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInFlow: "popup",
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        console.log("Sign-in successful!");
        return true;
      },
      signInFailure: function (error) {
        console.error("Sign-in failure:", error);
        return handleSignInFailure(error);
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