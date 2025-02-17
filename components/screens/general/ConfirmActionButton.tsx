import { DimensionValue } from "react-native"
import CustomButton from "@/components/customs/CustomButton"
import ModalActionConfirm from "@/components/base/ModalActionConfirm"
import React, { useState } from "react"

type ConfirmActionButtonProps = {
    btnTitle: string
    description: string
    onConfirm: () => void
    closeOnConfirm?: boolean
    onCancel?: () => void
    isActive?: boolean
    btnColor?: {
        text: string
        border: string
    }
    btnWidth?: DimensionValue
}

export default function ConfirmActionButton({
    btnTitle,
    description,
    onConfirm,
    closeOnConfirm = true,
    onCancel,
    isActive = true,
    btnColor,
    btnWidth,
}: ConfirmActionButtonProps) {
    const [ open, setOpen ] = useState<boolean>(false)

    return (
        <>
            <ModalActionConfirm
                isOpen={ open }
                setIsOpen={ setOpen }
                title={ btnTitle }
                description={[description]}
                onChange={ (e) => {
                    if (e) {
                        onConfirm()
                        if (closeOnConfirm) return
                    }
                    if (onCancel) onCancel()
                    setOpen(false)
                }}
            />
            <CustomButton
                title={ btnTitle  }
                onPress={ () => setOpen(true) }
                active={ isActive }
                btnColor={ btnColor ? btnColor.border : undefined }
                btnTextColor={ btnColor ? btnColor.text : undefined }
                btnWidth={ btnWidth }
            />
        </>
    )
}