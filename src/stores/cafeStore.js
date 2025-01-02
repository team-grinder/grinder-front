import { defineStore } from 'pinia'
import $axios from '@/plugins/axios'

export const useCafeStore = defineStore('cafe', {
    state: () => ({
        popularCafes: [], // 인기 카페 목록
        recentCafes: [], // 최근 방문한 카페 목록
    }),
    actions: {
        // 인기 카페 목록 불러오기
        async fetchPopularCafes() {
            try {
                const response = await $axios.get('/cafes/popular');
                console.log('인기 카페 목록:', response.data);

                if (response.status === 200) {
                    this.popularCafes = response.data;
                }
            } catch (error) {
                console.error('인기 카페 목록 불러오기 실패:', error);
            }
        },

        // 최근 방문한 카페 목록 불러오기
        async fetchRecentCafes() {
            try {
                const response = await $axios.get('/cafes/recent');
                console.log('최근 방문한 카페 목록:', response.data);

                if (response.status === 200) {
                    this.recentCafes = response.data;
                }
            } catch (error) {
                console.error('최근 방문한 카페 목록 불러오기 실패:', error);
            }
        },
    },
})