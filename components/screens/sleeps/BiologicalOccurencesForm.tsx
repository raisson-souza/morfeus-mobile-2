import { BiologicalOccurencesType } from "@/types/biologicalOccurences"
import { StyleSheet } from "react-native"
import { useState } from "react"
import BiologicalOccurencesInfoModal from "./biologicalOccurencesInfoModal"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomSwitch from "@/components/customs/CustomSwitch"
import CustomText from "@/components/customs/CustomText"
import React from "react"

type BiologicalOccurencesProps = {
    value: BiologicalOccurencesType
    onChange: (e: BiologicalOccurencesType) => void
}

export default function BiologicalOccurencesForm({
    value,
    onChange,
}: BiologicalOccurencesProps) {
    const [ openInfoModal, setOpenInfoModal ] = useState<boolean>(false)
    const [ open, setOpen ] = useState<boolean>(false)

    return (
        <Box.Column>
            <Box.Row style={ styles.switchesBtn }>
                <CustomSwitch
                    value={ open }
                    label=""
                    onChange={ (e) => setOpen(e) }
                />
                <CustomText
                    weight="bold"
                    size="s"
                >Ocorrências biológicas durante o sono</CustomText>
            </Box.Row>
            {
                open
                    ? <>
                        <CustomButton
                            title="Informações sobre ocorrências biológicas"
                            onPress={ () => setOpenInfoModal(true) }
                        />
                        <BiologicalOccurencesInfoModal
                            visible={ openInfoModal }
                            setVisible={ setOpenInfoModal }
                        />
                        <Box.Column style={ styles.switchesBox }>
                            <CustomSwitch
                                value={ value.sudorese }
                                label="Sudorese"
                                onChange={ (e) => onChange({ ...value, sudorese: e })}
                            />
                            <CustomSwitch
                                value={ value.bruxismo }
                                label="Bruxismo"
                                onChange={ (e) => onChange({ ...value, bruxismo: e })}
                            />
                            <CustomSwitch
                                value={ value.apneiaDoSono }
                                label="Apnéia do Sono"
                                onChange={ (e) => onChange({ ...value, apneiaDoSono: e })}
                            />
                            <CustomSwitch
                                value={ value.ronco }
                                label="Ronco"
                                onChange={ (e) => onChange({ ...value, ronco: e })}
                            />
                            <CustomSwitch
                                value={ value.movimentosPeriodicosDosMembros }
                                label="Movimentos Periódicos dos Membros"
                                onChange={ (e) => onChange({ ...value, movimentosPeriodicosDosMembros: e })}
                            />
                            <CustomSwitch
                                value={ value.despertaresParciais }
                                label="Despertares Parciais"
                                onChange={ (e) => onChange({ ...value, despertaresParciais: e })}
                            />
                            <CustomSwitch
                                value={ value.refluxoGastroesofagico }
                                label="Refluxo Gastroesofágico"
                                onChange={ (e) => onChange({ ...value, refluxoGastroesofagico: e })}
                            />
                            <CustomSwitch
                                value={ value.sialorreia }
                                label="Sialorréia"
                                onChange={ (e) => onChange({ ...value, sialorreia: e })}
                            />
                            <CustomSwitch
                                value={ value.arritmias }
                                label="Arritmias"
                                onChange={ (e) => onChange({ ...value, arritmias: e })}
                            />
                            <CustomSwitch
                                value={ value.mioclonia }
                                label="Mioclonia"
                                onChange={ (e) => onChange({ ...value, mioclonia: e })}
                            />
                            <CustomSwitch
                                value={ value.parassonia }
                                label="Parassonia"
                                onChange={ (e) => onChange({ ...value, parassonia: e })}
                            />
                            <CustomSwitch
                                value={ value.epistaxe }
                                label="Epistaxe"
                                onChange={ (e) => onChange({ ...value, epistaxe: e })}
                            />
                            <CustomSwitch
                                value={ value.miccaoInvoluntaria }
                                label="Micção Involuntária"
                                onChange={ (e) => onChange({ ...value, miccaoInvoluntaria: e })}
                            />
                            <CustomSwitch
                                value={ value.evacuacaoInvoluntaria }
                                label="Evacuação Involuntária"
                                onChange={ (e) => onChange({ ...value, evacuacaoInvoluntaria: e })}
                            />
                            <CustomSwitch
                                value={ value.polucao }
                                label="Polução Noturna"
                                onChange={ (e) => onChange({ ...value, polucao: e })}
                            />
                        </Box.Column>
                    </>
                    : <></>
            }
        </Box.Column>
    )
}

const styles = StyleSheet.create({
    switchesBtn: {
        alignItems: "center",
        flexWrap: "wrap",
    },
    switchesBox: {
        paddingLeft: 20,
    },
})