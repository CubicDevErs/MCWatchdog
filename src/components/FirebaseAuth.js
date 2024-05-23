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
  ui.start(containerId, {
    signInSuccessUrl: "/#/dashboard",
    signInOptions: [
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        clientId:
          "606031045534-74p4nprdtduh06gtgqkf1b8n411cg9s1.apps.googleusercontent.com",
      },
    ],
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInFlow: 'popup',
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        console.log("Sign-in successful!");
        return true;
      },
    },
  });

  ui.disableAutoSignIn();
};
