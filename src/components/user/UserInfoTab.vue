<template>
  <article class="cafe_info_tab">
    <div id="show_article_button" @click="changeView('ArticleList')">
      <span>🦭 내 리뷰</span>
    </div>
    <div id="show_book_button" @click="changeView('BookList')">
      <span>⚙️ 예약 정보</span>
    </div>
  </article>
</template>

<script>

export default {
  name: "UserInfoTab",
  methods: {
    changeView(viewName) {
      this.$emit("change-view", viewName);
    },
  },
}
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