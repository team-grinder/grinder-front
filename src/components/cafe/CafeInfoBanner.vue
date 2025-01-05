<template>
  <!-- 배너 전체를 감싸는 카드 -->
  <v-card
      max-width="1200"
      class="mx-auto my-4 pa-0 cafe-info-banner"
      elevation="3"
      rounded="lg"
  >
    <!-- 카페 배경 이미지 -->
    <v-img
        :src="cafeInfo.imageUrl || ''"
        height="150"
        cover
        gradient="to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)"
        class="cafe-info-banner__image"
    >
        <v-container fill-height class="pa-0">
          <v-row
              align="center"
              justify="start"
              class="fill-height ma-0"
          >
            <!-- 왼쪽: 카페 로고 -->
            <v-col
                cols="auto"
                class="d-flex justify-center"
            >
              <v-avatar
                  size="128"
                  class="cafe-info-banner__logo"
              >
                <v-img
                    :src="cafeInfo.logoUrl || defaultImage"
                    alt="카페 로고"
                    cover
                ></v-img>
              </v-avatar>
            </v-col>

            <!-- 오른쪽: 카페 상세 정보 -->
            <v-col
                class="text-white"
                cols="auto"
            >
              <h2 class="cafe-info-banner__name">
                {{ cafeInfo.name }}
              </h2>

              <address class="cafe-info-banner__address">
                {{ cafeInfo.address }}
              </address>

              <!-- 별점 표시 -->
              <div class="d-flex align-center mb-2">
                <span class="mr-2">평균 평점:</span>
                <template v-for="n in 5" :key="n">
                  <v-icon
                      v-if="n <= cafeInfo.averageGrade"
                      color="yellow"
                      size="24"
                      density="compact"
                  >
                    mdi-star
                  </v-icon>
                  <v-icon
                      v-else
                      color="yellow"
                      size="24"
                      density="compact"
                  >
                    mdi-star-outline
                  </v-icon>
                </template>
              </div>

              <!-- 연락처 -->
              <div>
                <strong>연락처</strong> : {{ cafeInfo.phoneNum }}
              </div>
            </v-col>
          </v-row>
        </v-container>
    </v-img>
  </v-card>
</template>

<script>
import defaultImagePath from '@/assets/images/default-cafe-logo.png';

class CafeInfo {
  constructor(name, address, imageUrl, logoUrl, averageGrade, phoneNum) {
    this.name = name;
    this.address = address;
    this.imageUrl = imageUrl;
    this.logoUrl = logoUrl;
    this.averageGrade = averageGrade;
    this.phoneNum = phoneNum;
  }
}

export default {
  name: 'CafeInfoBanner',
  data() {
    return {
      defaultImage: defaultImagePath,
    };
  },
  props: {
    cafeInfo: {
      type: CafeInfo,
      required: true,
    },
  },
};
</script>
<style scoped>
.cafe_info_background .cafe_info_data h2 {
  position: relative;
  font-family: 'GodoB', sans-serif;
  font-size: 2em;
  color: #FFFFFF;
  margin-bottom: 0.3em;
}

.cafe_info_background .cafe_info_data address {
  font-size: 1em;
  color: #8A8A8A;
  margin-bottom: 0.5em;
}

.cafe_info_background .cafe_info_data .cafe_info_score img {
  margin: 0 0 0 10px;
}

.cafe_info_background .cafe_info_database span {
  color: #8A8A8A;
  font-size: 1em;
  margin-top: 0.5em;
}
</style>