<template>
  <div>
    <UserInfoBanner :nickname="nickname" :imageUrl="imageUrl" :tier="tier" />
    <UserInfoTab :is-cafe-manager="isCafeManager" @change-view="handleChangeView"/>
    <v-divider class="cafe_info_line"></v-divider>

    <router-view
        :is-authenticated="isAuthenticated"
        :userId="userId"
        :nickname="nickname"
        :image-url="imageUrl"
        :loading="loading"
    ></router-view>
  </div>
</template>

<script>
import router from "@/router";
import { useFeedStore } from "@/stores/feedStore";
import { useUserStore } from "@/stores/userStore";
import UserInfoBanner from "@/components/user/UserInfoBanner.vue";
import UserInfoTab from "@/components/user/UserInfoTab.vue";

export default {
  name: "UserInformation",
  components: {
    UserInfoTab,
    UserInfoBanner,
  },
  data() {
    return {
      loading: true,
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
    isCafeManager() {
      return this.userStore.tier === 'CAFE_MANAGER' || this.userStore.tier === 'ADMIN';
    },
  },
  methods: {
    handleChangeView(view) {
      // 각 뷰에 맞는 라우트로 이동
      switch(view) {
        case 'ArticleList':
          this.$router.push({ name: 'UserArticleList' });
          break;
        case 'BookList':
          this.$router.push({ name: 'UserBookList' });
          break;
        case 'CafeManagerList':
          this.$router.push({ name: 'UserCafeManagerList' });
          break;
        default:
          this.$router.push({ name: 'UserInformation' });
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

    await this.getArticles();
    this.loading = false;
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