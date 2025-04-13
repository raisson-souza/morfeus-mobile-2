import { Screen } from "@/components/base/Screen"
import { useEffect, useState } from "react"
import { useSQLiteContext } from "expo-sqlite"
import Loading from "@/components/base/Loading"
import TermOfAcceptanceScreen from "../general/TermOfAcceptanceScreen"

type TermOfAcceptanceEnclosureProps = {
    children: JSX.Element
}

export default function TermOfAcceptanceEnclosure({
    children,
}: TermOfAcceptanceEnclosureProps) {
    const db = useSQLiteContext()
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ showTerm, setShowTerm ] = useState<boolean>(false)

    useEffect(() => {
        const fetchTermOfAcceptanceRead = async () => {
            await db.getFirstAsync<{ term_of_acceptance_read: number }>('SELECT term_of_acceptance_read FROM PARAMS')
                .then(result => {
                    if (result) {
                        if (result.term_of_acceptance_read === 0) {
                            setShowTerm(true)
                        }
                    }
                })
                .finally(() => setLoading(false))
        }
        fetchTermOfAcceptanceRead()
    }, [])
    
    return loading
        ? <Screen flex>
            <Loading />
        </Screen>
        : showTerm
            ? <TermOfAcceptanceScreen setAsReaded={() => setShowTerm(false)} />
            : children
}