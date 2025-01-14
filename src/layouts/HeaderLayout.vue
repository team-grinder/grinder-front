<template>
  <div>
    <Header
        :is-authenticated="isAuthenticated"
        :nickname="nickname"
        :image-url="imageUrl"
        :dropdown-options="dropdownOptions"
        @search="handleSearch"
        @go-to-my-page="goToMyPage"
        @logout="logout"
    />
    <router-view />
  </div>
</template>

<script>
import Header from "@/components/main/Header.vue";
import { useUserStore } from "@/stores/userStore";
import router from "@/router";

export default {
  name: "DefaultLayout",
  components: {
    Header,
  },
  data() {
    return {
      searchType: "all",
      searchKeyword: "",
      dropdownOptions: [
        { value: "all", label: "전체" },
        { value: "cafe", label: "카페" },
        { value: "feed", label: "피드" },
        { value: "member", label: "회원" },
      ],
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    isAuthenticated() {
      return this.userStore.isAuthenticated;
    },
    id() {
      return this.userStore.id;
    },
    nickname() {
      return this.userStore.nickname;
    },
    imageUrl() {
      return this.userStore.imageUrl;
    },
  },
  async mounted() {
    // 컴포넌트가 로드되면 세션 확인
    await this.userStore.checkSession();
  },
  methods: {
    handleSearch({ searchType, searchKeyword }) {
      alert(`검색 유형: ${searchType}, 키워드: ${searchKeyword}`);
    },
    goToMyPage() {
      router.push({ name: "UserInformation" });
    },
    async logout() {
      await this.userStore.logout();
      await router.push({ name: "Home" });
      window.location.reload();
    },
  },
};
</script>