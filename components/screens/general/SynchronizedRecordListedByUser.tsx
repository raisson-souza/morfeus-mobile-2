import { StyleContextProvider } from "@/contexts/StyleContext"
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons"

type SynchronizedRecordListedByUserProps = {
    useSync: boolean
    isSynchronized: boolean | null
}

export default function SynchronizedRecordListedByUser({
    useSync,
    isSynchronized,
}: SynchronizedRecordListedByUserProps): JSX.Element {
    const { systemStyle } = StyleContextProvider()

    if (useSync) {
        if (isSynchronized != null) {
            if (!isSynchronized) {
                return <IconMaterialIcons
                    name="sync-problem"
                    color="red"
                    size={ systemStyle.largeIconSize }
                />
            }
        }
    }
    return <></>
}