import Vue from 'vue'
import Router from 'vue-router'
import Bb from '@/components/Bb'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Bb',
      component: Bb
    },
  ]
})
