// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { Button, Row, Col, Swipe, SwipeItem, Lazyload, List,
  Field, NavBar, Tab, Tabs, list, PullRefresh, stepper,
  Tabbar, TabbarItem } from 'vant'

Vue.use(Button).use(Row).use(Col).use(Swipe).use(SwipeItem).use(Lazyload).use(list).use(Field).use(NavBar)
  .use(Tab).use(Tabs).use(list).use(PullRefresh).use(stepper)
  .use(Tabbar).use(TabbarItem)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
