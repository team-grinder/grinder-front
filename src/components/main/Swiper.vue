<template>
  <swiper
      :loop="true"
      :pagination="{ clickable: true }"
      :navigation="true"
      class="swiper"
  >
    <swiper-slide>
      <a href="#">
        <div class="text-wrap">
          <p>✨광고</p>
          <h2>제목 공간</h2>
          <p>내용 공간</p>
        </div>
        <img src="@/assets/images/mainPage.png" alt="광고 이미지" />
      </a>
    </swiper-slide>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
    <div class="swiper-box"></div>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default {
  name: 'SwiperComponent',
  components: {
    Swiper,
    SwiperSlide,
  },
};
</script>

<style scoped>

.swiper {
  width: 100%;
  max-width: 1400px;
  height: 20em;
  background-color: #00a692;
  border-radius: 0.9375em;
  box-shadow: inset 0.1875em -0.25em 0.1875em 0 rgba(0, 0, 0, 0.25);
  z-index: 0;
}

.swiper .swiper-slide .text-wrap {
  position: absolute;
  top: 60%;
  left: 1.5625em;
  text-align: center;
}

.swiper .swiper-slide .text-wrap h2 {
  font-family: GodoM;
  font-weight: bold;
  color: #ffffff;
  font-size: 2.1875em;
  line-height: 1.25;
  margin: 0 0 0.625em 0;
}

.swiper .swiper-slide .text-wrap p {
  font-family: GodoM;
  color: #ffffff;
  font-size: 1.25em;
  text-align: left;
  margin: 0;
}

.swiper .swiper-wrapper .swiper-slide a img {
  width: 100%;
  object-fit: contain;
  object-position: center bottom;
}

.swiper-button-prev {
  width: 1.875em;
  height: 1.875em;
  background-image: url('@/assets/images/icon/arrow_back.png');
  top: 58.75em;
}

.swiper-button-next {
  width: 1.875em;
  height: 1.875em;
  background-image: url('@/assets/images/icon/arrow_next.png');
  top: 58.75em;
}

.swiper-button-prev:after,
.swiper-rtl .swiper-button-next:after,
.swiper-button-next:after,
.swiper-rtl .swiper-button-prev:after {
  display: none;
}

.swiper-box {
  position: absolute;
  height: 4.5em;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 2;
}
</style>