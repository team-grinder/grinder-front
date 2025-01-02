<template>
  <div class="cafe-list-container">
    <h2 class="cafe-list-title">지금 뜨는 카페</h2>
    <div class="cafe-list-divider"></div>
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
    </div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div class="cafe-list-info">
      <div
          v-for="cafe in cafes"
          :key="cafe.id"
          class="cafe-card"
          @click="navigateToCafe(cafe.id)"
      >
        <img
            :src="!!cafe.imageUrl ? cafe.imageUrl : defaultImage"
            :alt="cafe.name"
            class="cafe-card-image"
        />
        <div class="cafe-card-content">
          <h3 class="cafe-card-title">{{ cafe.name }}</h3>
          <p class="cafe-card-address">{{ cafe.address }}</p>
        </div>
      </div>
    </div>
    <div class="cafe-list-divider"></div>
  </div>
</template>

<script>
import defaultImagePath from '@/assets/images/default-cafe-logo.png';
import $axios from "@/plugins/axios";

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

        if (response.data.length === 0) this.error = "카페 정보가 없습니다.";
        else this.cafes = response.data;

        this.loading = false;

      } catch (err) {
        this.error = "카페 정보를 불러오지 못했습니다.";
        this.loading = false;
      }
    },
    navigateToCafe(cafeId) {
      this.$router.push(`/cafe/${cafeId}`);
    }
  },
  mounted() {
    this.fetchCafes();
  },
};
</script>

<style scoped>
.cafe-list-container {
  margin: 0 auto;
  padding: 0 1em;
  width: 100%;
  max-width: 1200px;
}

.cafe-list-container .cafe-list-title {
  margin-top: 2em;
  font-size: 1.2em;
}

.cafe-list-container .cafe-list-divider {
  margin: 1em 0;
  height: 0;
  border-bottom: #d0d0d0 solid 1px;
}

.cafe-list-container .cafe-list-info {
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(3, 1fr);
  height: 9.375em;
  align-items: center;
  margin: 0 5px;
}

.cafe-list-container .cafe-card {
  display: flex;
  user-select: none;
  cursor: pointer;
  border-radius: 10px;
  transition: box-shadow 0.2s ease;
}

.cafe-card-title {
  margin-top: 0.5em;
  font-family: 'GodoB', sans-serif;
  font-size: 1.2em;
  margin-bottom: 0.5em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.cafe-card-address {
  font-size: 1.0em;
  color: #A3A3A3;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.cafe-card-image {
  border-radius: 50%;
  height: 7em;
  width: 7em;
  margin-right: 0.9em;
}

.cafe_register_button {
  font-family: GodoM;
  font-size: 30px;
  color: #000;
  background-color: white;
  border: 1px solid #D9D9D9;
  border-radius: 30px;
  padding: 6px 18px;
  box-shadow: 3px 2px 4px 0 rgba(0,0,0,25%);
  margin: 78px auto;
  text-align: center;
  display: inline-block;
}

.error-message {
  font-family: GodoM;
  font-size: 1.2em;
  color: #777777;
  text-align: center;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px; /* 높이 설정 */
}

.spinner {
  width: 50px; /* 스피너 크기 */
  height: 50px;
  border: 5px solid #f3f3f3; /* 바깥 원의 색상 */
  border-top: 5px solid #009b55; /* 스피너의 회전 부분 색상 */
  border-radius: 50%; /* 원형으로 만들기 */
  animation: spin 1s linear infinite; /* 애니메이션 적용 */
}

@keyframes spin {
  0% {
    transform: rotate(0deg); /* 초기 위치 */
  }
  100% {
    transform: rotate(360deg); /* 1회전 */
  }
}

</style>