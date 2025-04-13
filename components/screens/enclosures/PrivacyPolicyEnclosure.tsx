import { Screen } from "@/components/base/Screen"
import { useEffect, useState } from "react"
import { useSQLiteContext } from "expo-sqlite"
import Loading from "@/components/base/Loading"
import PrivacyPolicyScreen from "../general/PrivacyPolicyScreen"

type PrivacyPolicyEnclosureProps = {
    children: JSX.Element
}

export default function PrivacyPolicyEnclosure({
    children,
}: PrivacyPolicyEnclosureProps) {
    const db = useSQLiteContext()
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ showTerm, setShowTerm ] = useState<boolean>(false)

    useEffect(() => {
        const fetchPrivacyPolicyRead = async () => {
            await db.getFirstAsync<{ privacy_policy_read: number }>('SELECT privacy_policy_read FROM PARAMS')
                .then(result => {
                    if (result) {
                        if (result.privacy_policy_read === 0) {
                            setShowTerm(true)
                        }
                    }
                })
                .finally(() => setLoading(false))
        }
        fetchPrivacyPolicyRead()
    }, [])

    return loading
        ? <Screen flex>
            <Loading />
        </Screen>
        : showTerm
            ? <PrivacyPolicyScreen setAsReaded={() => setShowTerm(false)} />
            : children
}