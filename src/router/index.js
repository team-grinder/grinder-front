import { createRouter, createWebHistory } from 'vue-router';

import HeaderLayout from "@/layouts/HeaderLayout.vue";
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import CafeInformation from '@/views/CafeInformation.vue';
import UserInformation from '@/views/UserInformation.vue';
import Admin from '@/views/Admin.vue';
import AdminLogin from '@/views/AdminLogin.vue';
import BookPaymentPage from '@/views/BookPayment.vue';

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
            {
                path: 'myPage',
                name: 'UserInformation',
                component: UserInformation,
                props: true,
            }
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
    },
    {
        path: '/admin',
        name: 'Admin',
        component: Admin,
    },
    {
        path: '/payment',
        component: BookPaymentPage,
        props: (route) => ({
            memberId: route.query.memberId,
            reservationDate: route.query.reservationDate,
            selectedTimes: route.query.selectedTimes.split(',').map(Number),
            selectedPersons: Number(route.query.selectedPersons),
            totalPrice: Number(route.query.totalPrice),
        }),
    },
    {
        path: '/payment/success',
        component: () => import('@/views/PaymentSuccess.vue'),
        props: true
    },
    {
        path: '/payment/fail',
        component: () => import('@/views/PaymentFail.vue'),
        props: true
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;