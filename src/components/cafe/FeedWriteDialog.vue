<!-- FeedWriteDialog.vue -->
<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        {{ feedTitle }}
      </v-card-title>
      <v-card-text>
        <p v-if="isCreate">{{ reviewInfo.cafeName }}에 대한 리뷰를 작성해주세요.</p>
        <v-textarea
            v-model="localReviewContent"
            rows="5"
            variant="underlined"
            class="w-100"
        ></v-textarea>
        <p>사진을 첨부해주세요.</p>
        <v-file-input
            v-model="localReviewImages"
            label="File input"
            prepend-icon="mdi-camera"
            variant="underlined"
            accept="image/*"
            multiple
        />
        <div
            v-if="Array.isArray(localReviewImages) && localReviewImages.length"
            class="d-flex justify-center"
        >
          <v-img
              v-for="(image, index) in localReviewImages"
              :key="index"
              :src="createImageUrl(image)"
              class="my-2 ma-1"
              max-width="100"
              @remove="revokeImageUrl(image)"
          ></v-img>
        </div>
        <p>평점을 선택해주세요.</p>
        <v-rating
            hover
            :length="5"
            :size="32"
            v-model="localReviewRating"
            active-color="yellow-darken-2"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn color="red-lighten-1" @click="closeDialog">취소</v-btn>
        <v-btn color="green-darken-1" @click="submit">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "FeedWriteDialog",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    feedTitle: {
      type: String,
      required: true,
    },
    isCreate: {
      type: Boolean,
      required: true,
    },
    /** 리뷰 작성할 카페 정보 */
    reviewInfo: {
      type: Object,
      required: false,
    },
    /** 초기 리뷰 내용 */
    reviewContent: {
      type: String,
      default: "",
    },
    /** 초기 첨부 이미지 배열 */
    reviewImages: {
      type: Array,
      default: () => [],
    },
    /** 초기 평점 */
    reviewRating: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      // 부모에서 받은 값을 로컬 상태로 복사하여 수정 후, 확인 시 부모에 전달합니다.
      localReviewContent: this.reviewContent,
      localReviewImages: this.reviewImages,
      localReviewRating: this.reviewRating,
    };
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    createImageUrl(file) {
      if (file instanceof File) {
        return URL.createObjectURL(file);
      }
      return "";
    },
    revokeImageUrl(file) {
      if (file instanceof File) {
        URL.revokeObjectURL(file);
      }
    },
    closeDialog() {
      // 다이얼로그를 닫으면서 부모에 상태 전달
      this.$emit("input", false);
    },
    submit() {
      // 확인 버튼 클릭 시, 로컬 데이터를 부모로 emit 합니다.
      this.$emit("submit", {
        content: this.localReviewContent,
        images: this.localReviewImages,
        rating: this.localReviewRating,
      });
      // 다이얼로그 닫기
      this.$emit("input", false);
    },
  },
  watch: {
    // 부모에서 값이 변경되면 로컬 데이터도 갱신
    reviewContent(newVal) {
      this.localReviewContent = newVal;
    },
    reviewImages(newVal) {
      this.localReviewImages = newVal;
    },
    reviewRating(newVal) {
      this.localReviewRating = newVal;
    },
  },
};
</script>

<style scoped>
</style>