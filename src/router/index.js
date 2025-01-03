import { createRouter, createWebHistory } from 'vue-router';

import HeaderLayout from "@/layouts/HeaderLayout.vue";
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import CafeInformation from '@/views/CafeInformation.vue';
import AdminLogin from '@/views/AdminLogin.vue';

const routes = [
    {
        path: '/',
        component: HeaderLayout,
        children: [
            {
                path: '',
                name: 'Home',
                component: Home,
            },
            {
                path: 'cafe/:id',
                name: 'CafeInformation',
                component: CafeInformation,
                props: true,
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/admin/login',
        name: 'AdminLogin',
        component: AdminLogin,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;