<template>
  <section class="cafe_info_banner">
    <div class="cafe_info_background">
      <img v-if="cafeInfo.imageUrl" class="cafe_info_background_img" :src="cafeInfo.imageUrl" alt="" />
      <div v-else class="cafe_info_background_img" style="background-color: #D9D9D9;"></div>
      <div class="cafe_info_data">
        <img class="cafe_info_logo" :src="!!cafeInfo.logoUrl ? cafeInfo.logoUrl : defaultImage" alt="" />
        <div class="cafe_info_data_wrap">
          <h2 id="cafe-name">{{ cafeInfo.name }}</h2>
          <div class="cafe_information">
            <address id="cafe-address">{{ cafeInfo.address }}</address>
          </div>
          <div class="cafe_info_score">
            평균 평점:
            <template v-for="n in 5" :key="n">
              <img v-if="n <= cafeInfo.averageGrade" src="@/assets/images/icon/star-fill.png" alt="" />
              <img v-else src="@/assets/images/icon/star.png" alt="" />
            </template>
          </div>
        </div>
      </div>
      <div class="cafe_info_database">
        <span id="cafe-phonenum">연락처: {{ cafeInfo.phoneNum }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import defaultImagePath from '@/assets/images/default-cafe-logo.png';

export default {
  name: 'CafeInfoBanner',
  data() {
    return {
      defaultImage: defaultImagePath,
    };
  },
  props: {
    cafeInfo: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style scoped>
.cafe_info_banner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.cafe_info_background {
  /*background-color: black;*/
  border-radius: 0 0 15px 15px;
}

.cafe_info_background .cafe_info_background_img {
  height: 12em;
  border-radius: 0 0 15px 15px;
}

.cafe_info_background .cafe_info_database {
  padding: 0 1.5em;
  display: flex;
  justify-content: end;
  margin-bottom: 60px;
}

.cafe_info_background .cafe_info_data {
  position: absolute;
  top: 95px;
  display: flex;
  float: left;
}

.cafe_info_background .cafe_info_logo {
  background-color: #FFFFFF;
  position: relative;
  width: 11.25em;
  height: 11.25em;
  margin-right: 1.4375em;
  border-radius: 50%;
  border: 1px solid #D9D9D9;
}

.cafe_info_background .cafe_info_data .cafe_info_data_wrap {
  position: relative;
  top: 3.5em;
  height: 8em;
}

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

.cafe_info_background .cafe_info_data .cafe_info_score {
  display: flex;
  float: left;
  font-size: 1.2em;
}

.cafe_info_background .cafe_info_data .cafe_info_score img {
  margin: 0 0 0 10px;
}

.cafe_info_background .cafe_info_database span {
  color: #8A8A8A;
  font-size: 1em;
  margin-top: 0.5em;
}

.cafe_info_banner:after {
  content: "";
  display: table;
  clear: both;
}
</style>