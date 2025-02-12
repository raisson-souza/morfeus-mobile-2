import { DimensionValue } from "react-native"
import CustomButton from "@/components/customs/CustomButton"
import ModalActionConfirm from "@/components/base/ModalActionConfirm"
import React, { useState } from "react"

type ConfirmRecordDeletionProps = {
    btnTitle?: string
    recordName?: string
    deletionAction: () => void
    isActive?: boolean
    btnColor?: {
        text: string
        border: string
    }
    btnWidth?: DimensionValue
}

export default function ConfirmRecordDeletion({
    btnTitle = "Excluir",
    recordName = "este registro",
    deletionAction,
    isActive = true,
    btnColor = {
        text: "red",
        border: "red",
    },
    btnWidth,
}: ConfirmRecordDeletionProps) {
    const [ open, setOpen ] = useState<boolean>(false)

    return (
        <>
            <ModalActionConfirm
                isOpen={ open }
                setIsOpen={ setOpen }
                title={ `Tem certeza que deseja excluir ${ recordName }?` }
                description={[
                    "Esta ação não poderá ser desfeita.",
                ]}
                onChange={ (e) => {
                    if (e) deletionAction()
                    setOpen(false)
                }}
            />
            <CustomButton
                title={ btnTitle  }
                onPress={ () => setOpen(true) }
                active={ isActive }
                btnColor={ btnColor.border }
                btnTextColor={ btnColor.text }
                btnWidth={ btnWidth }
            />
        </>
    )
}