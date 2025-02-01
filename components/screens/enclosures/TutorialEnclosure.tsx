import { useEffect } from "react"
import { useSQLiteContext } from "expo-sqlite"

type TutorialEnclosureProps = {
    children: JSX.Element
    openTutorialAction: () => void
}

export default function TutorialEnclosure({
    children,
    openTutorialAction,
}: TutorialEnclosureProps) {
    const db = useSQLiteContext()

    useEffect(() => {
        const fetchTutorialRead = async () => {
            await db.getFirstAsync<{ tutorial_read: number }>('SELECT tutorial_read FROM PARAMS')
                .then(result => {
                    if (result) {
                        if (result.tutorial_read === 0) {
                            openTutorialAction()
                        }
                    }
                })
        }
        fetchTutorialRead()
    }, [])

    return children
}