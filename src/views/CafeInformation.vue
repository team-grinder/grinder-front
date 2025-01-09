<template>
  <div>
    <CafeInfoBanner :cafeInfo="cafeInfo" />
    <CafeInfoTab :cafeInfo="cafeInfo" @change-view="handleChangeView"/>
    <div class="cafe_info_line"></div>
    <component
        :is="currentView"
        :is-authenticated="isAuthenticated"
        :nickname="nickname"
        :image-url="imageUrl"
        :cafeInfo="cafeInfo"/>
  </div>
</template>

<script>
import CafeInfoBanner from '@/components/cafe/CafeInfoBanner.vue';
import CafeInfoTab from '@/components/cafe/CafeInfoTab.vue';
import ArticleList from "@/components/cafe/ArticleList.vue";
import MenuList from "@/components/cafe/MenuList.vue";
import Calendar from "@/components/cafe/Calendar.vue";
import { useUserStore } from "@/stores/userStore";
import axios from 'axios';
import Header from "@/components/main/Header.vue";

export default {
  name: 'CafeInformation',
  components: {
    Header,
    CafeInfoBanner,
    CafeInfoTab,
    ArticleList,
    MenuList,
    Calendar,
  },
  data() {
    return {
      cafeInfo: null, // 카페 정보를 저장
      loading: true,
      currentView: "ArticleList", // 기본값으로 MenuList를 표시
      error: null,
    };
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    isAuthenticated() {
      return this.userStore.isAuthenticated;
    },
    nickname() {
      return this.userStore.nickname;
    },
    imageUrl() {
      return this.userStore.imageUrl;
    },
  },
  methods: {
    handleChangeView(viewName) {
      // 버튼 클릭에 따라 표시할 컴포넌트를 변경
      this.currentView = viewName;
    },
  },
  async created() {
    try {
      this.cafeInfo = {
        "id": 1,
        "name": "Bluebird Coffee",
        "address": "123 Coffee Street",
        "phoneNum": "010-1234-5678",
        "averageGrade": 4.5,
        "logoUrl": "",
        "imageUrl": ""
      };
      const response = await axios.get(`cafe/${this.id}`);

      response.data;
    } catch (err) {
      this.error = '카페 정보를 불러올 수 없습니다.';
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.cafe_info_line {
  margin: 1.5em auto;
  width: 100%;
  max-width: 1200px;
  border-top: 1px solid #D9D9D9;
}
</style>