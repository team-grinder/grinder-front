import 'vuetify/styles';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'
import DateFnsAdapter from '@date-io/date-fns'
import ko from 'date-fns/locale/ko'
import { createVuetify } from 'vuetify'
import koVuetify from 'vuetify/lib/locale/ko.mjs'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
    },
    // Vuetify i18n 설정
    locale: {
        locale: 'ko',
        fallback: 'en',
        messages: {
            ko: koVuetify,
        },
    },
    date: {
        adapter: DateFnsAdapter,
        locale: {
            ko: ko,
        },
    },
})

export default vuetify;