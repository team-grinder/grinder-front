<template>
  <article class="cafe_info_tab">
    <div id="show_article_button" @click="changeView('ArticleList')">
      <span>평가글 보기</span>
    </div>
    <div id="show_menu_button" @click="changeView('MenuList')">
      <span>메뉴 보기</span>
    </div>
    <div v-if="isAuthenticated" id="show_calendar_button" @click="changeView('BookPage')">
      <span>예약 보기</span>
    </div>
    <div id="seller_apply_button" @click="applySeller">
      <span>판매자 신청</span>
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


  <!-- 판매자 신청 모달 -->
  <v-dialog v-model="sellerDialog" max-width="500">
    <v-card>
      <v-card-title>
        판매자 신청
      </v-card-title>
      <v-card-text>
        <v-form ref="sellerForm">
          <!-- 사업자 성함 -->
          <v-text-field
              v-model="sellerName"
              label="사업자 성함"
              required
              class="mt-2"
          ></v-text-field>

          <!-- 연락처 -->
          <v-text-field
              v-model="contact"
              label="연락처"
              required
              class="mt-2"
              type="tel"
          ></v-text-field>

          <!-- 사업자등록번호 -->
          <v-text-field
              v-model="businessNumber"
              label="사업자등록번호"
              required
              class="mt-2"
          ></v-text-field>

          <!-- 사업자등록증 사본 -->
          <p class="mt-4">사업자등록증 사본을 첨부해주세요.</p>
          <v-file-input
              v-model="businessDocument"
              label="파일 첨부"
              prepend-icon="mdi-file"
              accept="image/*, .pdf"
              required
          ></v-file-input>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red-lighten-1" @click="sellerDialog = false">취소</v-btn>
        <v-btn color="green-darken-1" @click="submitSellerApplication">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
    },
    isAuthenticated: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isBookmarked: false,

      sellerDialog: false, // 모달 열림 여부
      sellerName: "", // 사업자 성함
      contact: "", // 연락처
      businessNumber: "", // 사업자등록번호
      businessDocument: null, // 사업자등록증 사본
    };
  },
  methods: {
    changeView(viewName) {
      this.$emit("change-view", viewName);
    },
    applySeller() {
      this.sellerDialog = true;
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

    submitSellerApplication() {
      if (!this.$refs.sellerForm.validate()) {
        alert("모든 필수 정보를 입력해주세요.");
        return;
      }

      const formData = new FormData();
      formData.append("sellerName", this.sellerName);
      formData.append("contact", this.contact);
      formData.append("businessNumber", this.businessNumber);

      if (this.businessDocument) {
        formData.append("businessDocument", this.businessDocument);
      }

      // TODO: 서버로 데이터 전송
      $axios.post("/seller", formData)
          .then(() => {
            alert("판매자 신청이 완료되었습니다.");
          })
          .catch(() => {
            alert("판매자 신청에 실패했습니다.");
          });
      this.sellerDialog = false;
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