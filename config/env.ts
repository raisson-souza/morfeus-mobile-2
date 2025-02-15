type envProps = {
    /** URL base do backend */
    BackendUrl: () => string
    /** Ambiente do frontend */
    Environment: () => "testing" | "production"
    /** Email para suporte */
    DevContact: () => string
    /** Versão da aplicação */
    AppVersion: () => string
    /** Link da aplicação na google play */
    GooglePlayAppLink: () => string
    /** Credenciais do Firebase */
    FirebaseCredentials: () => FirebaseCredentialsType
}

type FirebaseCredentialsType = {
    apiKey: string,
    authDomain: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
    measurementId: string,
}

/** Buscador de variáveis de ambiente */
const env : envProps = {
    BackendUrl: () => {
        const _ = String(process.env["EXPO_PUBLIC_BACKEND_URL"])
        if (_ === '' || _ === 'undefined') {
            console.error("EXPO_PUBLIC_BACKEND_URL não encontrado no ENV.")
            throw new Error("EXPO_PUBLIC_BACKEND_URL não encontrado no ENV.")
        }
        return _
    },
    Environment: () => {
        const _ = String(process.env["EXPO_PUBLIC_ENV"])
        return _ === undefined || _ === null || _ === 'undefined' || _ === 'null' || _ === 'testing'
            ? "testing"
            : "production"
    },
    DevContact: () => {
        const _ = String(process.env["EXPO_PUBLIC_DEV_EMAIL"])
        if (_ === undefined || _ === null || _ === 'undefined' || _ === 'null') {
            console.error("EXPO_PUBLIC_DEV_EMAIL não encontrado no ENV.")
            throw new Error("EXPO_PUBLIC_DEV_EMAIL não encontrado no ENV.")
        }
        return _
    },
    AppVersion: () => {
        const _ = String(process.env["EXPO_PUBLIC_APP_VERSION"])
        if (_ === undefined || _ === null || _ === 'undefined' || _ === 'null') {
            console.error("EXPO_PUBLIC_APP_VERSION não encontrado no ENV.")
            throw new Error("EXPO_PUBLIC_APP_VERSION não encontrado no ENV.")
        }
        return _
    },
    GooglePlayAppLink: () => {
        const _ = String(process.env["EXPO_PUBLIC_GOOGLE_PLAY_APP_LINK"])
        if (_ === undefined || _ === null || _ === 'undefined' || _ === 'null') {
            console.error("EXPO_PUBLIC_GOOGLE_PLAY_APP_LINK não encontrado no ENV.")
            throw new Error("EXPO_PUBLIC_GOOGLE_PLAY_APP_LINK não encontrado no ENV.")
        }
        return _
    },
    FirebaseCredentials: () => {
        const apiKey = String(process.env["EXPO_PUBLIC_FIREBASE_API_KEY"])
        const authDomain = String(process.env["EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"])
        const projectId = String(process.env["EXPO_PUBLIC_FIREBASE_PROJECT_ID"])
        const storageBucket = String(process.env["EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"])
        const messagingSenderId = String(process.env["EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"])
        const appId = String(process.env["EXPO_PUBLIC_FIREBASE_APP_ID"])
        const measurementId = String(process.env["EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID"])

        if (
            (apiKey === undefined || apiKey === null || apiKey === 'undefined' || apiKey === 'null') ||
            (authDomain === undefined || authDomain === null || authDomain === 'undefined' || authDomain === 'null') ||
            (projectId === undefined || projectId === null || projectId === 'undefined' || projectId === 'null') ||
            (storageBucket === undefined || storageBucket === null || storageBucket === 'undefined' || storageBucket === 'null') ||
            (messagingSenderId === undefined || messagingSenderId === null || messagingSenderId === 'undefined' || messagingSenderId === 'null') ||
            (appId === undefined || appId === null || appId === 'undefined' || appId === 'null') ||
            (measurementId === undefined || measurementId === null || measurementId === 'undefined' || measurementId === 'null')
        ) {
            console.error("Credenciais do firebase não encontradas no ENV.")
            throw new Error("Credenciais do firebase não encontradas no ENV.")
        }

        return {
            apiKey,
            authDomain,
            projectId,
            storageBucket,
            messagingSenderId,
            appId,
            measurementId,
        }
    },
}

export default env