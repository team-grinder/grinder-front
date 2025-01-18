<template>
  <article class="cafe_info_tab">
    <div id="show_article_button" class="tab_box"
         @click="changeView('ArticleList')">
      <span>내 리뷰</span>
    </div>
    <div id="show_book_button" class="tab_box"
         @click="changeView('BookList')">
      <span>예약 정보</span>
    </div>
    <v-spacer></v-spacer>
    <div
        v-if="isCafeManager"
        id="show_cafe_management_button" class="tab_box"
        @click="changeView('CafeManagement')">
      <span>카페 관리</span>
    </div>
  </article>
</template>

<script>

export default {
  name: "UserInfoTab",
  props: {
    isCafeManager: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    changeView(viewName) {
      this.$emit("change-view", viewName);
    },
  },
}
</script>

<style type="scss" scoped>
.cafe_info_tab {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1em 1em 0;

  .tab_box {
    border-radius: 30px;
    box-shadow: 3px 2px 4px 0px rgba(0,0,0,25%);
    padding: 0.6em 1.2em;
    margin-right: 1.2em;
    cursor: pointer;
    border: 1px solid #D9D9D9;
    background-color: white;

    span {
      font-family: 'GodoB', sans-serif;
      font-size: 1em;
    }
  }

  &:after {
    content: "";
    display: table;
    clear: both;
  }
}
</style>