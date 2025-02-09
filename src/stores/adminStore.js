import { defineStore } from "pinia";
import $axios from "@/plugins/axios";

export const useAdminStore = defineStore("admin", {
    state: () => ({
        isAuthenticated: false, // 로그인 상태
        id: null, // 사용자 ID
        name: null, // 사용자 이름
    }),
    actions: {
        resetAdmin() {
            this.isAuthenticated = false;
            this.id = null;
            this.name = null;
        },
        async checkSession() {
            if (this.isAuthenticated) return;

            try {
                const response = await $axios.get("/session/validate", {});

                if (response.status === 200 && response.data.code === "200") {
                    const userData = response.data.data;
                    this.setAdmin(userData);
                } else {
                    this.resetAdmin();
                }
            } catch (error) {
                console.error("세션 확인 실패:", error);
                this.resetAdmin();
            }
        },
        async resetAndCheckSession() {
            this.resetAdmin();
            await this.checkSession();
        },
        setAdmin(userData) {
            this.isAuthenticated = true;
            this.id = userData.id;
            this.name = userData.name;
        }
    },
    getters: {

    }
});