<template>
  <div>
    <Header
        :isAuthenticated="isAuthenticated"
        :username="username"
        :memberImageUrl="memberImageUrl"
        :dropdownOptions="dropdownOptions"
        @search="handleSearch"
        @go-to-my-page="goToMyPage"
    />
    <router-view />
  </div>
</template>

<script>
import Header from "@/components/main/Header.vue";

export default {
  name: "DefaultLayout",
  components: {
    Header,
  },
  data() {
    return {
      isAuthenticated: false,
      username: "그라인더",
      memberImageUrl: null,
      dropdownOptions: [
        { value: "all", label: "전체" },
        { value: "cafe", label: "카페" },
        { value: "feed", label: "피드" },
        { value: "member", label: "회원" },
      ],
    };
  },
  methods: {
    handleSearch({ searchType, searchKeyword }) {
      alert(`검색 유형: ${searchType}, 키워드: ${searchKeyword}`);
    },
    goToMyPage() {
      window.location.href = `/mypage/${this.username}`;
    },
  },
};
</script>