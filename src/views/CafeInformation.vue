<template>
  <div>
    <CafeInfoBanner :cafeInfo="cafeInfo" />
    <CafeInfoTab
        :cafeInfo="cafeInfo"
        :userId="userId"
        :isAuthenticated="isAuthenticated"
        @change-view="handleChangeView"/>

    <v-divider class="cafe_info_line"></v-divider>

    <component
        :is="currentView"
        :is-authenticated="isAuthenticated"
        :member-id="userId"
        :articles="articles"
        :nickname="nickname"
        :image-url="imageUrl"
        :cafeInfo="cafeInfo"
        :loading="loading"
    />
  </div>
</template>

<script>
import CafeInfoBanner from '@/components/cafe/CafeInfoBanner.vue';
import CafeInfoTab from '@/components/cafe/CafeInfoTab.vue';
import ArticleList from "@/components/cafe/ArticleList.vue";
import MenuList from "@/components/cafe/MenuList.vue";
import BookPage from "@/components/cafe/BookPage.vue";
import { useUserStore } from "@/stores/userStore";
import $axios from '@/plugins/axios';
import router from "@/router";

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
      loading: true,
      currentView: "ArticleList",
      error: null,
      articles: [],
      page: 1,
      size: 5,
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

        console.log(response.data);

        this.cafeInfo = response.data.data;
      } catch (err) {
        this.error = '카페 정보를 불러올 수 없습니다.';
      } finally {
        this.loading = false;
      }
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
          attachments: [
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150",
          ],
          showComments: false, // 댓글 영역 토글
          newComment: {
            content: "",
          },
          comments: [
            {
              nickname: "김영희",
              memberImage: "",
              content: "저도 동감합니다!",
              showReplies: false,
              newReply: {
                content: "",
              },
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
        const response = await $axios.get(`feed/cafe/${this.id}`, {
          params: {
            page: this.page,
            size: this.size,
          }
        });
        console.log(response.data);
      } catch (err) {
        this.error = '게시글을 불러올 수 없습니다.';
      } finally {
        this.loading = false;
      }
    }
  },
  async created() {
    if (!this.isAuthenticated) {
      await router.push({ name: "Login" });
    }

    await this.getCafeInfo();
    await this.getArticles();
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