<template>
  <div class="menu_card_main">
    <h2>메뉴 목록</h2>
    <div v-if="loading">메뉴를 불러오는 중...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-for="menu in menus" :key="menu.id" class="menu_card_container">
        <div class="menu_card_wrap">
          <h1 class="menu_card_name">{{ menu.menuName }}</h1>
          <ul>
            <li>예상 가격: {{ menu.menuPrice }}</li>
            <li>수정 일자: {{ menu.menuUpdate }}</li>
          </ul>
          <div class="menu_card_detail_title">
            <img class="menu_card_bulb" src="@/assets/images/icon/bulb.png" alt="메뉴 상세보기 아이콘" />
            <div class="menu_card_detail">메뉴 상세보기</div>
          </div>
          <div class="menu_card_detail_line"></div>
          <div class="menu_card_detail_list">
            <ul>
              <li>용량: {{ menu.volume }}</li>
              <li>설명: {{ menu.menuDetails }}</li>
            </ul>
            <ul>
              <li>알러지 재료: {{ menu.menuAllergy }}</li>
              <li>판매 유형: {{ menu.menuIsLimited }}</li>
            </ul>
          </div>
        </div>
        <img
            class="menu_card_img"
            :src="menu.menuImage || menuDefaultImage"
            alt="메뉴 이미지"
        />
      </div>
    </div>
  </div>
</template>

<script>
import menuDefaultImagePath from "@/assets/images/feed-default-img-gray.png";

export default {
  name: "MenuList",
  props: {
    cafeInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      menus: [
        {
          id: 1,
          menuName: "아메리카노",
          menuPrice: 4500,
          menuUpdate: "2024-03-25",
          volume: "410ml",
          menuDetails: "신선한 원두로 내린 아메리카노입니다.",
          menuAllergy: "없음",
          menuIsLimited: "상시",
          menuImage: null,
        },
        {
          id: 2,
          menuName: "카페라떼",
          menuPrice: 5000,
          menuUpdate: "2024-03-20",
          volume: "350ml",
          menuDetails: "부드러운 우유와 에스프레소가 조화를 이룬 메뉴입니다.",
          menuAllergy: "우유",
          menuIsLimited: "상시",
          menuImage: null,
        },
      ],
      loading: false, // 더미 데이터 사용으로 로딩 상태는 false
      error: null,
      menuDefaultImage : menuDefaultImagePath,
    };
  },
  created() {
    // 메뉴 목록을 불러오는 API 호출
  },
};
</script>

<style scoped>
.menu_card_main {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.menu_card_main h2 {
  font-size: 2em;
  margin: 0.5em 0 0 0.5em;
}

.menu_card_container {
  display: flex;
  justify-content: space-between;
  border: 1px solid #D9D9D9;
  border-radius: 15px;
  padding: 1em;
  margin:1em 1em 1em 1em;
}

.menu_card_wrap {
  display: flex;
  flex-direction: column;
}

.menu_card_name {
  font-family: 'NanumGothic', sans-serif;
  font-size: 1.8em;
  margin: 10px 0 5px 0;
}

.menu_card_detail_title {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  margin: 0.8em 0 0.2em 0;
}

.menu_card_bulb {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  white-space: nowrap;
  margin-right: 5px;
}

.menu_card_detail {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  font-family: 'GodoM', sans-serif;
  font-size: 1.1em;
  white-space: nowrap;
}

.menu_card_detail_line {
  border-top: 1px solid #D9D9D9;
  margin: 0.8em 0;
}

.menu_card_detail_list {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.menu_card_img {
  display: inline-block;
  height: 10em;
  border-radius: 15px;
}

.menu_card_container ul {
  display: inline-block;
}

.menu_card_container li {
  font-family: 'NanumGothic Light', sans-serif;
  font-size: 1em;
  color: #666666;
  margin: 8px 108px 8px 8px;
}
</style>