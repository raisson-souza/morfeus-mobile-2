import env from "@/config/env"
import { initializeApp } from "firebase/app"
// import { getAnalytics } from "firebase/analytics"

const firebaseCredentials = env.FirebaseCredentials()

const firebaseConfig = {
    apiKey: firebaseCredentials.apiKey,
    authDomain: firebaseCredentials.authDomain,
    projectId: firebaseCredentials.projectId,
    storageBucket: firebaseCredentials.storageBucket,
    messagingSenderId: firebaseCredentials.messagingSenderId,
    appId: firebaseCredentials.appId,
    measurementId: firebaseCredentials.measurementId,
}

const firebaseApp = initializeApp(firebaseConfig)
// const analytics = getAnalytics(firebaseApp)

// export { firebaseApp, analytics }
export { firebaseApp }