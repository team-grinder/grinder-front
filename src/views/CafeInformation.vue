<template>
  <div>
    <CafeInfoBanner :cafeInfo="cafeInfo" />
    <CafeInfoTab
        :cafeInfo="cafeInfo"
        :userId="userId"
        :isAuthenticated="isAuthenticated"
        @change-view="handleChangeView"/>

    <v-divider class="cafe_info_line"></v-divider>

    <v-progress-circular
        v-if="loading"
        class="ma-auto"
        indeterminate
        color="green darken-1"
    ></v-progress-circular>

    <component
        v-else
        :is="currentView"
        :is-authenticated="isAuthenticated"
        :member-id="userId"
        :nickname="nickname"
        :image-url="imageUrl"
        :cafeInfo="cafeInfo"
        @load-more="getArticles"
    />

  </div>
</template>

<script>
import router from "@/router";
import $axios from '@/plugins/axios';
import { useUserStore } from "@/stores/userStore";
import { useFeedStore } from "@/stores/feedStore";
import CafeInfoBanner from '@/components/cafe/CafeInfoBanner.vue';
import CafeInfoTab from '@/components/cafe/CafeInfoTab.vue';
import ArticleList from "@/components/cafe/ArticleList.vue";
import MenuList from "@/components/cafe/MenuList.vue";
import BookPage from "@/components/cafe/BookPage.vue";

export default {
  name: 'CafeInformation',
  components: {
    CafeInfoBanner,
    CafeInfoTab,
    ArticleList,
    MenuList,
    BookPage,
  },

  data() {
    return {
      cafeInfo: {},
      currentView: "ArticleList",
      error: null,
      loading: true,
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
  },
  methods: {
    handleChangeView(viewName) {
      // 버튼 클릭에 따라 표시할 컴포넌트를 변경
      this.currentView = viewName;
    },

    async getCafeInfo() {
      try {
        const response = await $axios.get(`cafe/${this.id}`);

        this.cafeInfo = response.data.data;
      } catch (err) {
        this.error = '카페 정보를 불러올 수 없습니다.';
      }
    },

    async getArticles() {
      await useFeedStore().getFeedList(this.id);
    },
  },

  async created() {
    await useUserStore().resetAndCheckSession();

    if (!this.isAuthenticated) {
      await router.push({ name: "Login" });
    }

    await this.getCafeInfo();
    await useFeedStore().getFeedList(this.id);

    this.loading = false;
  },

  async beforeUnmount() {
    useFeedStore().resetFeedList();
  },
};
</script>

<style scoped>
.cafe_info_line {
  margin: 1.5em auto;
  width: 100%;
  max-width: 1200px;
}
</style>