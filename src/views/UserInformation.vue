<template>
  <div>
    <UserInfoBanner
        :nickname="nickname"
        :imageUrl="imageUrl"
        :tier="tier"
    />
    <UserInfoTab @change-view="handleChangeView"/>

    <v-divider class="cafe_info_line"></v-divider>

    <component
        :is="currentView"
        :is-authenticated="isAuthenticated"
        :nickname="nickname"
        :image-url="imageUrl"
        :loading="loading"
        :articles="articles"
    />
  </div>
</template>

<script>
import UserInfoBanner from "@/components/user/UserInfoBanner.vue";
import UserInfoTab from "@/components/user/UserInfoTab.vue";
import ArticleList from "@/components/cafe/ArticleList.vue";
import BookList from "@/components/user/BookList.vue";
import { useUserStore } from "@/stores/userStore";
import $axios from "@/plugins/axios";
import router from "@/router";

export default {
  name: "UserInformation" ,
  components: {
    UserInfoTab,
    UserInfoBanner,
    ArticleList,
    BookList,
  },
  data() {
    return {
      userInfo: null,
      loading: true,
      currentView: "ArticleList",
      error: null,
      articles: [],
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

    async getArticles() {
      this.articles = [
        {
          id: 1,
          nickname: "홍길동",
          memberImage: "",
          content: "카페가 너무 좋아요!",
          rating: 4.5,
          period: "2025-01-01",
          likes: 2,
          showComments: false, // 댓글 영역 토글
          newComment: {
            nickname: "",    // 새 댓글 작성 시 입력
            memberImage: "",
            content: "",
          },
          attachments: [
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150",
          ],
          currentImageIndex: 0,
          comments: [
            {
              nickname: "김영희",
              memberImage: "",
              content: "저도 동감합니다!",
              showReplies: false,
              newReply: { content: "" },
              replies: [
                {
                  nickname: "이철수",
                  memberImage: "",
                  content: "저도 좋아요!",
                  showReplies: false,
                  newReply: { content: "" },
                  replies: []
                }
              ]
            },
          ]
        },
      ];

      try {
        const response = await $axios.get(`cafe/${this.id}/articles`);
        console.log(response.data);
      } catch (err) {
        this.error = '게시글을 불러올 수 없습니다.';
      } finally {
        this.loading = false;
      }
    },
  },
  async created() {
    await this.getArticles();

    if (!this.isAuthenticated) {
      await router.push({ name: "Login" });
    }
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