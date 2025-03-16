<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h5">
        관리 중인 카페 목록
      </v-card-title>

      <v-card-text v-if="loading">
        <div class="d-flex justify-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
      </v-card-text>

      <v-card-text v-else-if="cafeList.length === 0">
        <v-alert type="info" text>
          관리 중인 카페가 없습니다.
        </v-alert>
      </v-card-text>
      <v-list v-else>
        <v-list-item v-for="cafe in cafeList" :key="cafe.id" :title="cafe.name" :subtitle="cafe.address">
          <template v-slot:prepend>
            <v-avatar size="64" class="me-4">
              <v-img :src="cafe.imageUrl || defaultCafeImage" alt="카페 이미지"></v-img>
            </v-avatar>
          </template>
          <template v-slot:append>
            <div class="d-flex flex-column gap-2">
              <v-btn color="primary" @click="manageCafeReservations(cafe.id)" size="small">
                <v-icon left>mdi-calendar-check</v-icon>
                예약 관리
              </v-btn>
              <v-btn color="pink" @click="manageCafeInfo(cafe.id)" size="small">
                <v-icon left>mdi-coffee</v-icon>
                카페 정보 변경
              </v-btn>
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import axios from '@/plugins/axios';
import { useUserStore } from "@/stores/userStore";
import defaultCafeImage from "@/assets/images/grinder-logo.png"; // 기본 카페 이미지 경로 확인 필요

export default {
  name: 'CafeManagerList',
  data() {
    return {
      cafeList: [],
      loading: true,
      error: null,
      defaultCafeImage: defaultCafeImage
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    userId() {
      return this.userStore.id;
    },
    isAuthenticated() {
      return this.userStore.isAuthenticated;
    }
  },
  methods: {
    async fetchManagedCafes() {
      this.loading = true;
      try {
        const response = await axios.get(`/cafe-manager/${this.userId}/cafes`);
        this.cafeList = response.data.data || [];
      } catch (error) {
        console.error('관리 중인 카페 목록 불러오기 실패:', error);
        this.error = '카페 목록을 불러올 수 없습니다.';
      } finally {
        this.loading = false;
      }
    },
    manageCafeReservations(cafeId) {
      this.$router.push({
        name: 'CafeManagement',
        params: { id: cafeId },
        query: { view: 'BookManagement' }
      });
    },
    manageCafeInfo(cafeId) {
      this.$router.push({
        name: 'CafeManagement',
        params: { id: cafeId },
        query: { view: 'ChangeCafeInfo' }
      });
    }
  },
  async created() {
    if (this.isAuthenticated) {
      await this.fetchManagedCafes();
    }
  }
};
</script>