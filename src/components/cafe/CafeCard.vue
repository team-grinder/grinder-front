<template>
  <div class="cafe-list-container">
    <h2 class="cafe-list-title">지금 뜨는 카페</h2>
    <div class="cafe-list-divider"></div>
    <div v-if="loading" class="loading">불러오는 중...</div>
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
        const dummyData = [
          {
            id: 1,
            name: "스타벅스",
            imageUrl: "",
            address: "123 Champs-Élysées, Paris, France",
            description: "A cozy Parisian cafe offering the best espresso.",
            tel: "+33 1 23 45 67 89"
          },
          {
            id: 2,
            name: "스타벅스",
            imageUrl: "",
            address: "456 Main Street, New York, USA",
            description: "Artisan coffee with a touch of Brooklyn charm.",
            tel: "+1 212-555-0199"
          },
          {
            id: 3,
            name: "스타벅스",
            imageUrl: "",
            address: "789 Sunset Blvd, Los Angeles, USA",
            description: "Bright and sunny cafe with delicious pastries.",
            tel: "+1 323-555-0111"
          }
        ];

        // 데이터 설정
        this.cafes = dummyData;
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

.cafe-card-content {
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

.loading {
  text-align: center;
}

</style>