<template>
  <article class="cafe_info_tab">
    <div id="show_article_button" @click="changeView('ArticleList')">
      <span>🦭 평가글 보기</span>
    </div>
    <div id="show_menu_button" @click="changeView('MenuList')">
      <span>📋 메뉴 보기</span>
    </div>
    <div id="show_calendar_button" @click="changeView('Calendar')">
      <span>📅 예약 보기</span>
    </div>
    <div id="seller_apply_button" @click="applySeller">
      <span>👷 판매자 신청</span>
    </div>
    <div
        class="cafe_info_bookmark"
        id="bookmark_null"
        v-if="!isBookmarked"
        @click="addBookmark"
    >
      <img src="@/assets/images/icon/pin-angle.png" alt="" />
    </div>
    <div
        class="cafe_info_bookmark"
        id="bookmark_fill"
        v-if="isBookmarked"
        @click="deleteBookmark"
    >
      <img src="@/assets/images/icon/pin-angle-fill.png" alt="" />
    </div>
  </article>
</template>

<script>
import $axios from "@/plugins/axios";

export default {
  name: 'CafeInfoTab',
  props: {
    cafeInfo: {
      type: Object,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      isBookmarked: false,
    };
  },
  methods: {
    changeView(viewName) {
      this.$emit("change-view", viewName);
    },
    applySeller() {
      alert('판매자 신청 기능은 준비 중입니다.');
    },
    addBookmark() {
      this.isBookmarked = true;
      alert('북마크가 추가되었습니다!');
    },
    deleteBookmark() {
      this.isBookmarked = false;
      alert('북마크가 삭제되었습니다!');
    },
    async checkBookmark() {
      // 북마크 여부 확인
      await $axios.get(`/bookmark/${this.userId}/${this.cafeInfo.id}`)
          .then(() => {
            this.isBookmarked = true;
          })
          .catch(() => {
            this.isBookmarked = false;
          });
    },
  },
  mounted() {
    // 북마크 여부 확인
    // this.isBookmarked = this.$store.getters.isBookmarked(this.cafeInfo.id);
  }
};
</script>

<style scoped>
.cafe_info_tab {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1em 1em 0;
}

.cafe_info_tab div {
  border-radius: 30px;
  box-shadow: 3px 2px 4px 0px rgba(0,0,0,25%);
  padding: 0.6em 1.2em;
  margin-right: 1.2em;
  cursor: pointer;
  border: 1px solid #D9D9D9;
  background-color: white;
}

.cafe_info_tab .cafe_info_bookmark {
  padding: 0.4em 0.4em;
}

.cafe_info_tab div span {
  font-family: 'GodoB', sans-serif;
  font-size: 1em;
}

.cafe_info_tab:after {
  content: "";
  display: table;
  clear: both;
}
</style>