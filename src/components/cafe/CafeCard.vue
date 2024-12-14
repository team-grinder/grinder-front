<template>
  <div class="cafe-list-container">
    <h2 class="cafe-list-title">지금 뜨는 카페</h2>
    <div class="cafe-list-divider"></div>
    <div v-if="loading" class="loading">불러오는 중...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else class="cafe-list-info">
      <div
          v-for="cafe in cafes"
          :key="cafe.cafeId"
          class="cafe-card"
          @click="navigateToCafe(cafe.cafeId)"
      >
        <img
            :src="cafe.cafeImageUrl || defaultImage"
            :alt="cafe.cafeName"
            class="cafe-card-image"
        />
        <div class="cafe-card-content">
          <h3 class="cafe-card-title">{{ cafe.cafeName }}</h3>
          <p class="cafe-card-address">{{ cafe.cafeAddress }}</p>
          <ul class="cafe-card-tags">
            <li v-for="tag in cafe.tagList" :key="tag" class="cafe-card-tag">{{ tag }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="cafe-list-divider"></div>
  </div>
</template>

<script>


export default {
  name: "CafeCardComponent",
  data() {
    return {
      cafes: [], // API에서 가져온 카페 데이터
      loading: true, // 로딩 상태
      error: null, // 에러 메시지
      defaultImage: "@/assets/images/default-cafe-logo.png", // 기본 이미지
    };
  },
  methods: {
    async fetchCafes() {
    },
    navigateToCafe(cafeId) {
      this.$router.push(`/cafe/${cafeId}`);
    },
  },
  mounted() {
    this.fetchCafes();
  },
};
</script>

<style scoped>
.cafe-list-title {
  margin-top: 35px;
  font-size: 25px;
}

.cafe-list-divider {
  margin: 16px 0;
  height: 0;
  border-bottom: #d0d0d0 solid 1px;
}

.cafe-list-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.cafe-list-info {
  height: 150px;
  display: flex;
  align-items: center;
  margin: 0 5px;
  user-select: none;
  cursor: pointer;
  border-radius: 10px;
  transition: box-shadow 0.2s ease;
}

.cafe-list-info:hover {
  box-shadow: 5px 5px 3px 3px rgba(38, 114, 0, 0.16);
  transform: translateY(-3px);
}

.cafe-card-content {
  width: 320px;
}

.cafe-card-title {
  margin-top: 8px;
  font-family: 'GodoB', sans-serif;
  font-size: 28px;
  margin-bottom: 10px;
}

.cafe-card-address {
  font-size: 20px;
  color: #A3A3A3;
}

.cafe-card-tags {
  margin-top: 11px;
}

.cafe-list-tag-list li {
  display: inline-block;
  padding: 7px 5px;
  border: #D9D9D9 solid 1px;
  border-radius: 30px;
  box-shadow: 3px 3px 5px 0 #D9D9D9;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
}

.cafe-card-image {
  border-radius: 50%;
  height: 120px;
  width: 120px;
  margin-right: 15px;
}

.no_cafe_message {
  margin: 51px auto 0 auto;
  text-align: center;
  font-size: 30px;
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

.no_cafe_container {
  text-align: center;
}

</style>