import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {
  Table, TableColumn, Dialog, Button, DatePicker, Form, Select, Option,
  FormItem, Radio, Input,
  RadioGroup,
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Button);
Vue.use(DatePicker);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Input);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
