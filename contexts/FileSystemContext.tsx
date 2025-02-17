import { createContext, useContext, useEffect, useState } from "react"
import * as FileSystem from "expo-file-system"
import DefaultLoadingScreen from "@/components/screens/general/DefaultLoadingScreen"

type FileSystemContextProps = {
    children: JSX.Element | JSX.Element[]
}

type FileSystemContext = {
    getFiles: () => Promise<string[]>
    getFile: (fileName: string) => Promise<FileSystem.FileInfo>
    extractFile: (fileName: string) => Promise<string | null>
    createFile: (fileName: string, fileContent: string) => Promise<void>
    deleteFile: (fileName: string) => Promise<void>
    documentDirectory: string
}

const FileSystemContext = createContext<FileSystemContext | null>(null)

/** Context de gerenciamento de arquivos da aplicação */
export default function FileSystemContextComponent({ children }: FileSystemContextProps) {
    const [ loading, setLoading ] = useState<boolean>(true)

    const createBaseFolder = async () => {
        const folderUri = `${ FileSystem.documentDirectory }MorfeusFiles/`
        const folderInfo = await FileSystem.getInfoAsync(folderUri)
        if (!folderInfo.exists) await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true })
    }

    useEffect(() => {
        createBaseFolder().finally(() => setLoading(false))
    }, [])

    const documentDirectory = `${ FileSystem.documentDirectory }MorfeusFiles/`

    const getFiles = async (): Promise<string[]> => {
        return await FileSystem.readDirectoryAsync(documentDirectory)
    }

    const getFile = async (fileName: string): Promise<FileSystem.FileInfo> => {
        const fileUri = `${ documentDirectory }${ fileName }`
        return await FileSystem.getInfoAsync(fileUri)
    }

    const extractFile = async (fileName: string): Promise<string | null> => {
        const fileUri = `${ documentDirectory }${ fileName }`
        const fileInfo = await FileSystem.getInfoAsync(fileUri)

        if (!fileInfo.exists) return null

        return await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 })
    }

    const createFile = async (fileName: string, fileContent: string): Promise<void> => {
        const fileUri = `${ documentDirectory }${ fileName }`
        await FileSystem.writeAsStringAsync(fileUri, fileContent, { encoding: FileSystem.EncodingType.UTF8 });
    }

    const deleteFile = async (fileName: string): Promise<void> => {
        const fileUri = `${ documentDirectory }${ fileName }`
        await FileSystem.deleteAsync(fileUri)
    }

    if (loading) return <DefaultLoadingScreen />

    return (
        <FileSystemContext.Provider value={{
            getFiles,
            getFile,
            extractFile,
            createFile,
            deleteFile,
            documentDirectory,
        }}>
            { children }
        </FileSystemContext.Provider>
    )
}

export function FileSystemContextProvider() {
    const context = useContext(FileSystemContext)
    if (!context) throw new Error("FileSystemContext chamado fora do provider.")
    return context
}