import { z } from "zod"
import { zodI18nMap } from "zod-i18n-map"
import i18next from "i18next"
import ptTranslation from "zod-i18n-map/locales/pt/zod.json"

i18next.init({
    compatibilityJSON: "v4",
    lng: "pt",
    fallbackLng: 'en',
    resources: {
        pt: { zod: ptTranslation },
    },
})

z.setErrorMap(zodI18nMap)

export { z }