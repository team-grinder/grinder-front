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
        @load-more="getArticles"
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
      page: 0,
      size: 5,
      noContents: false,
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
      } finally {
        this.loading = false;
      }
    },

    async getArticles() {
      if (this.noContents) return;

      if (this.loading) return;
      this.loading = true;
      try {
        const response = await $axios.get(`feed/cafe/${this.id}`, {
          params: {
            page: this.page,
            size: this.size,
          }
        });

        if (response.data.data.hasNext === false) {
          this.noContents = true;
        }

        const { content } = response.data.data; // content 배열

        // ① 서버 데이터를 ArticleList에서 요구하는 형태로 변환
        const newArticles = content.map(item => ({
          id: item.feedId,
          nickname: item.nickname,
          memberImage: item.memberImageUrl || '', // null 방어
          content: item.content,
          rating: item.grade,            // Vue 템플릿에서 article.rating 사용
          period: item.createDate,       // "YYYY-MM-DD" 문자열
          likes: item.likes,             // 좋아요 수
          attachments: item.imageTagList || [], // 이미지가 들어있는 배열
          showComments: false,           // 댓글창 펼침 여부
          newComment: { content: '' },   // 새 댓글 작성 폼
          comments: [],                  // 실제 댓글 목록
          commentPage: 0,                // 댓글 페이지
          isLike: item.like,           // 좋아요 여부
          isMine: item.mine,           // 내가 작성한 글 여부
        }));
        // 첫 페이지면 교체, 이후 페이지면 기존 배열에 추가
        if (this.page === 0) {
          this.articles = newArticles;
        } else {
          this.articles.push(...newArticles);
        }
        this.page++;

      } catch (err) {
        this.error = '게시글을 불러올 수 없습니다.';
      } finally {
        this.loading = false;
      }
    },
  },
  async created() {
    await useUserStore().checkSession();

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