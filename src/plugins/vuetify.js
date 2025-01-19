import 'vuetify/styles';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'
import DateFnsAdapter from '@date-io/date-fns'
import ko from 'date-fns/locale/ko'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
    },
    locale: {
        locale: 'ko',
    },
    date: {
        adapter: DateFnsAdapter,
        locale: {
            ko: ko,
        },
    },
})

export default vuetify;