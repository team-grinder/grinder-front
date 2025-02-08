<template>
  <div>
    <UserInfoBanner
        :nickname="nickname"
        :imageUrl="imageUrl"
        :tier="tier"
    />
    <UserInfoTab
        :is-cafe-manager="isCafeManager"
        @change-view="handleChangeView"/>

    <v-divider class="cafe_info_line"></v-divider>

    <component
        :is="currentView"
        :is-authenticated="isAuthenticated"
        :userId="userId"
        :nickname="nickname"
        :image-url="imageUrl"
        :loading="loading"
        :key="$route.fullPath"
    />
  </div>
</template>

<script>
import router from "@/router";
import $axios from "@/plugins/axios";
import { useFeedStore } from "@/stores/feedStore";
import { useUserStore } from "@/stores/userStore";
import UserInfoBanner from "@/components/user/UserInfoBanner.vue";
import UserInfoTab from "@/components/user/UserInfoTab.vue";
import ArticleList from "@/components/cafe/ArticleList.vue";
import BookList from "@/components/user/BookList.vue";
import CafeManagement from "@/components/user/CafeManagement.vue";

export default {
  name: "UserInformation" ,
  components: {
    UserInfoTab,
    UserInfoBanner,
    ArticleList,
    BookList,
    CafeManagement,
  },
  data() {
    return {
      userInfo: null,
      loading: true,
      currentView: "ArticleList",
      error: null,
      isCafeManager: true,
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
    },
    nickname() {
      return this.userStore.nickname;
    },
    imageUrl() {
      return this.userStore.imageUrl;
    },
    tier() {
      return this.userStore.tier;
    },
  },
  methods: {
    handleChangeView(view) {
      this.currentView = view;
    },

    async getIsCafeManager() {
      try {
        const response = await $axios.get(`/cafe/${this.userInfo.id}/manager`);
        console.log(response.data);
      } catch (err) {
        this.error = '카페 관리자 여부를 불러올 수 없습니다.';
      }
    },

    async getArticles() {
      await useFeedStore().getCafeFeedList();
    },
  },
  async created() {
    await useUserStore().resetAndCheckSession();

    if (!this.isAuthenticated) {
      await router.push({ name: "Login" });
    }

    // 쿼리 파라미터에서 'view' 값이 존재하면 currentView를 설정
    if (this.$route.query.view) {
      this.currentView = this.$route.query.view;
    }

    await this.getArticles();

  },

  async beforeUnmount() {
    useFeedStore().resetFeedList();
  },
}
</script>

<style scoped>
.cafe_info_line {
  margin: 1.5em auto;
  width: 100%;
  max-width: 1200px;
}
</style>