<template>
  <div>
    <Header
        :isAuthenticated="isAuthenticated"
        :userId="userId"
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
import axios from "axios";

export default {
  name: "DefaultLayout",
  components: {
    Header,
  },
  data() {
    return {
      isAuthenticated: false,
      userId: null,
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
    async checkSession() {
      // localStorage에서 JSESSIONID 가져오기
      const sessionId = localStorage.getItem("JSESSIONID");
      if (sessionId) {
        try {
          // 서버로 세션 정보 보내기
          const response = await axios.post(
              "/api/session/validate",
              {},
              {
                headers: {
                  Authorization: `${sessionId}`, // 세션 ID를 Authorization 헤더에 포함
                },
              }
          );

          // 받은 데이터로 상태 업데이트 (여기서는 더미 데이터 사용)
          this.username = response.data.username;
          this.memberImageUrl = response.data.memberImageUrl;
        } catch (error) {
          console.error("세션 확인 실패:", error);
          // 세션이 유효하지 않으면 초기화
          this.isAuthenticated = false;
          this.username = "그라인더";
          this.memberImageUrl = null;
        }
      }
      this.isAuthenticated = true;
      this.userId = 1;
      this.username = '그라인더';
      this.memberImageUrl = '';
    },
    handleSearch({ searchType, searchKeyword }) {
      alert(`검색 유형: ${searchType}, 키워드: ${searchKeyword}`);
    },
    goToMyPage() {
      window.location.href = `/mypage/${this.username}`;
    },
  },
  async mounted() {
    // 컴포넌트가 마운트되면 세션 확인
    await this.checkSession();
  },
};
</script>