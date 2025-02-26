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

      <v-list v-else lines="two">
        <v-list-item
            v-for="cafe in cafeList"
            :key="cafe.id"
            :title="cafe.name"
            :subtitle="cafe.address"
        >
          <template v-slot:append>
            <v-btn
                color="primary"
                @click="manageCafe(cafe.id)"
            >
              관리
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import axios from '@/plugins/axios';
import { useUserStore } from "@/stores/userStore";

export default {
  name: 'CafeManagerList',
  data() {
    return {
      cafeList: [],
      loading: true,
      error: null
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
        const response = await axios.get(`/member/${this.userId}/managed-cafes`); //생성 예정
        this.cafeList = response.data.data || [];
      } catch (error) {
        console.error('관리 중인 카페 목록 불러오기 실패:', error);
        this.error = '카페 목록을 불러올 수 없습니다.';
      } finally {
        this.loading = false;
      }
    },
    manageCafe(cafeId) {
      this.$router.push({
        name: 'CafeManagement',
        params: { id: cafeId }
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