import { ListDreamsByUserRequest } from "@/types/dream"
import { Picker } from "@react-native-picker/picker"
import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"

type DreamsListObjectiveFiltersProps = {
    listDreamsByUserForm: ListDreamsByUserRequest
    setListDreamsByUserForm: React.Dispatch<React.SetStateAction<ListDreamsByUserRequest>>
}

export default function DreamsListObjectiveFilters({
    listDreamsByUserForm,
    setListDreamsByUserForm,
}: DreamsListObjectiveFiltersProps) {
    return (
        <Box.Column style={ styles.container }>
            <Picker
                selectedValue={ listDreamsByUserForm.dreamCaracteristicsFilter }
                onValueChange={ (e) => setListDreamsByUserForm({
                    ...listDreamsByUserForm,
                    dreamCaracteristicsFilter: e,
                })}
            >
                <Picker.Item label="Todos os Sonhos" value="all" />
                <Picker.Item label="Todos os Sonhos (menos os ocultos)" value="allNotHidden" />
                <Picker.Item label="Todos os Sonhos (menos os eróticos)" value="allNotErotic" />
                <Picker.Item label="Todos os Sonhos (menos ocultos e eróticos)" value="allNotHiddenAndErotic" />
                <Picker.Item label="Todos os Sonhos Ocultos" value="allHidden" />
                <Picker.Item label="Todos os Sonhos Eróticos" value="allErotic" />
            </Picker>
            <Picker
                selectedValue={ listDreamsByUserForm.dreamOriginFilter }
                onValueChange={ (e) => setListDreamsByUserForm({
                    ...listDreamsByUserForm,
                    dreamOriginFilter: e,
                })}
            >
                <Picker.Item label="Todas as Origens" value="all" />
                <Picker.Item label="Sonhos Completos" value="completeDreams" />
                <Picker.Item label="Sonhos Rápidos" value="fastDreams" />
                <Picker.Item label="Sonhos Importados" value="importedDreams" />
            </Picker>
        </Box.Column>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
})