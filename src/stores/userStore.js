import { defineStore } from 'pinia';
import $axios from "@/plugins/axios";

export const useUserStore = defineStore('user', {
    state: () => ({
        isAuthenticated: false, // 로그인 상태
        id: null, // 사용자 ID
        nickname: null, // 사용자 이름
        imageUrl: null, // 프로필 이미지
        tier: null, // 사용자 등급
    }),
    actions: {
        // 사용자 정보 초기화
        resetUser() {
            this.isAuthenticated = false;
            this.id = null;
            this.nickname = null;
            this.imageUrl = null;
            this.tier = null;
        },

        // 세션 확인 및 사용자 정보 업데이트
        async checkSession() {
            if (this.isAuthenticated) return; // 이미 로그인 상태면 실행하지 않음

            try {
                const response = await $axios.get('/session/validate', {});
                console.log('세션 확인 결과:', response.data);

                if (response.status === 200 && response.data.code === "200") {
                    const userData = response.data.data;
                    this.setUser(userData); // 받은 데이터로 상태 업데이트
                } else {
                    this.resetUser(); // 세션이 유효하지 않으면 초기화
                }
            } catch (error) {
                console.error('세션 확인 실패:', error);
                this.resetUser(); // 세션이 유효하지 않으면 초기화
            }
        },

        async logout() {
            try {
                const response = await $axios.post('/logout', {});
                console.log('로그아웃 결과:', response.data);

                if (response.status === 200) {
                    this.resetUser(); // 사용자 정보 초기화
                }
            } catch (error) {
                console.error('로그아웃 실패:', error);
            }
        },

        // 로그인 후 사용자 정보 업데이트
        setUser(userData) {
            this.isAuthenticated = true;
            this.id = userData.id || null;
            this.nickname = userData.nickname || null;
            this.imageUrl = userData.imageUrl || null;
            this.tier = userData.tier || null;
        },
    },
});