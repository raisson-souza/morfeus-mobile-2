type envProps = {
    /** URL base do backend */
    BackendUrl: () => string,
    /** Ambiente do frontend */
    Environment: () => "testing" | "production",
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
}

export default env