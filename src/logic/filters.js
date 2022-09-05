import { createApp } from 'vue'
import App from '../App.vue'

const app = createApp(App)

//filtros

app.config.globalProperties.$filters = {
    capitalize(value){
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
    },
    decimal(value){
        if (!value) return 0
        return parseFloat(value).toFixed(2)
    }
}