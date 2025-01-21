import { createContext, useContext, useEffect, useRef, useState } from "react"
import { Screen } from "@/components/base/Screen"
import InternetInfo from "../utils/InternetInfo"
import Loading from "@/components/base/Loading"

type SyncContextProps = {
    children: JSX.Element | JSX.Element[]
}

type SyncContext = {
    /** Ref de conexão de internet */
    isConnectedRef: React.MutableRefObject<boolean>
    /** Ref de processo de sincronização */
    isSyncingRef: React.MutableRefObject<boolean>
    /**
     * Função base de sincronização de dados  
     * Realiza a atualização dos dados offline com dados da nuvem  
     * Realiza a atualização dos dados da nuvem com os dados offline
     * */
    syncData: () => Promise<void>
    /**
     * Ref para indicar se todos os dados locais e em nuvem estão atualizados  
     * É necessário setar como false em fluxos necessários nas services
     * */
    isDataUpToDate: React.MutableRefObject<boolean>
    checkIsConnected: () => boolean
}

const SyncContext = createContext<SyncContext | null>(null)

/** Context especializado na verificação de conectividade e sincronização dos dados da aplicação */
export default function SyncContextComponent({ children }: SyncContextProps) {
    const isConnectedRef = useRef<boolean>(false)
    const isSyncingRef = useRef<boolean>(false)
    const isDataUpToDate = useRef<boolean>(false)
    const [ loading, setLoading ] = useState<boolean>(true)

    useEffect(() => {
        InternetInfo()
            .then(result => {
                // Será definida a informação do REF sobre a conexão de internet antes do interval de 5 segundos 
                isConnectedRef.current = result ? result.isConnected : false
                setLoading(false)
            })

        /** Intervalo de verificação de conectividade */
        const syncInterval = setInterval(async () => {
            await InternetInfo()
                .then(result => { isConnectedRef.current = result ? result.isConnected : false })
        }, 5000)

        /** Intervalo de processamento de sincronização */
        const syncDataActionInterval = setInterval(async () => {
            // Se há conectividade, nenhum processo de sincronização ativo e se nem todos
            // os dados estão sincronizados, é necessário sincronizar
            if (
                isConnectedRef.current &&
                !isSyncingRef.current &&
                !isDataUpToDate.current
            ) await syncData()
        }, 10500)

        return () => {
            clearInterval(syncInterval)
            clearInterval(syncDataActionInterval)
        }
    }, [])

    /** Função base de sincronização de dados */
    const syncData = async (): Promise<void> => {
        isSyncingRef.current = true
        await syncLocalData()
        await syncCloudData()
        isSyncingRef.current = false
        isDataUpToDate.current = true
    }

    /** realiza a sincronização de dados locais com a nuvem */
    const syncLocalData = async (): Promise<void> => {
        try {
            // TODO: Atualização dos dados locais
        } catch (ex) {
            console.error("Houve um erro ao atualizar os dados locais:", (ex as Error).message)
        }
    }

    /** realiza a sincronização de dados em nuvem com dados locais */
    const syncCloudData = async (): Promise<void> => {
        try {
            // TODO: Atualização dos dados em nuvem
        } catch (ex) {
            console.error("Houve um erro ao atualizar os dados em nuvem:", (ex as Error).message)
        }
    }

    const checkIsConnected = (): boolean => {
        return isConnectedRef.current
    }

    if (loading) {
        return (
            <Screen flex>
                <Loading onlyLoading={ false } />
            </Screen>
        )
    }

    return (
        <SyncContext.Provider value={{
            isConnectedRef,
            isSyncingRef,
            syncData,
            isDataUpToDate,
            checkIsConnected,
        }}>
            { children }
        </SyncContext.Provider>
    )
}

export function SyncContextProvider() {
    const context = useContext(SyncContext)
    if (!context) throw new Error("SyncContext chamado fora do provider.")
    return context
}