<template>
  <v-container class="cafe-list-container">
    <v-row justify="center">
      <v-col cols="12" md="8" class="text-center">
        <v-card flat>
          <v-card-title class="text-h5 font-weight-bold">
            지금 뜨는 카페
          </v-card-title>
          <v-divider></v-divider>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col>
        <!-- 로딩 스피너 -->
        <v-row v-if="loading" justify="center">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
          </v-col>
        </v-row>

        <!-- 에러 메시지 -->
        <v-alert v-else-if="error" type="error" prominent dismissible>
          {{ error }}
        </v-alert>

        <!-- 카페 리스트 -->
        <v-row v-else>
          <v-col
              v-for="cafe in cafes"
              :key="cafe.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
          >
            <v-card class="cafe-card" @click="navigateToCafe(cafe.id)">
              <v-img
                  :src="cafe.imageUrl ? cafe.imageUrl : defaultImage"
                  :alt="cafe.name"
                  class="cafe-card-image"
                  height="120"
                  cover
              ></v-img>
              <v-card-title class="text-h6 font-weight-bold">{{ cafe.name }}</v-card-title>
              <v-card-subtitle class="cafe-card-address ml-2 mb-3 pa-0">
                <v-icon color="grey darken-1">mdi-map-marker</v-icon>
                {{ cafe.address }}
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-divider></v-divider>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import defaultImagePath from '@/assets/images/default-cafe-logo.png';
import $axios from "@/plugins/axios";
import router from "@/router";

export default {
  name: "CafeCardComponent",
  data() {
    return {
      cafes: [], // API에서 가져온 카페 데이터
      loading: true, // 로딩 상태
      error: null, // 에러 메시지
      defaultImage: defaultImagePath, // 기본 이미지
    };
  },
  methods: {
    async fetchCafes() {
      try {
        // JSON 더미 데이터를 직접 할당
        const response = await $axios.get("/cafe/popular");

        const result = response.data.data;

        if (result.length === 0) this.error = "카페 정보가 없습니다.";
        else this.cafes = result;

        this.loading = false;

      } catch (err) {
        this.error = "카페 정보를 불러오지 못했습니다.";
        this.loading = false;
      }
    },
    navigateToCafe(cafeId) {
      router.push(`/cafe/${cafeId}`);
    }
  },
  mounted() {
    this.fetchCafes();
  },
};
</script>

<style scoped>
.cafe-list-container {
  padding: 20px;
}

.cafe-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.cafe-card:hover {
  transform: scale(1.05);
}

.cafe-card-image {
  border-radius: 12px;
}

.cafe-card-address {
  font-size: 14px;
  color: grey;
}
</style>