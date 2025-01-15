<template>
  <v-container>
    <v-card
        class="bg-green-lighten-5 mx-auto mb-5"
        width="1200"
        variant="outlined"
        v-for="book in books"
        :key="book.id"
    >
      <template v-slot:title>
        <span class="font-weight-black">{{ book.cafeName }}</span>
      </template>
      <template v-slot:subtitle>
        <span>{{ book.period }}</span>
      </template>

      <v-card-text class="bg-white pt-4">
        <p>주소 : <span>{{ book.address }}</span></p>
        <p>인원 : <span>{{ book.headcount }}</span></p>
        <p>결제 비용 : <span>{{ book.payment }}</span></p>
        <p>결제 번호 : <span>{{ book.paymentNumber }}</span></p>
        <p>이용 상태 : <span>{{ book.status }}</span></p>

        <v-card-actions class="d-flex justify-end">
          <v-btn
              v-if="book.isCancellable"
              color="red-lighten-1"
              variant="tonal"
              @click="confirmCancel(book)"
          >
            예약 취소
          </v-btn>
          <v-btn
              v-if="book.isReviewable"
              color="green-darken-1"
              variant="tonal"
              @click="openReviewModal(book)"
          >
            리뷰 작성
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>

    <!-- 예약 취소 확인 모달 -->
    <v-dialog v-model="cancelDialog" max-width="500">
      <v-card>
        <v-card-title>
          예약 취소 확인
        </v-card-title>
        <v-card-text>
          <p>{{ cancelInfo.cafeName }}에서 예약을 취소하시겠습니까?</p>
          <p>예약 번호: {{ cancelInfo.paymentNumber }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red-lighten-1" @click="cancelDialog = false">취소</v-btn>
          <v-btn color="green-darken-1" @click="cancelBooking">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 리뷰 작성 모달 -->
    <v-dialog v-model="reviewDialog" max-width="500">
      <v-card>
        <v-card-title>
          리뷰 작성
        </v-card-title>
        <v-card-text>
          <p>{{ reviewInfo.cafeName }}에 대한 리뷰를 작성해주세요.</p>
          <v-textarea
              v-model="reviewContent"
              rows="5"
              variant="underlined"
              class="w-100">
          </v-textarea>
          <p>사진을 첨부해주세요.</p>
          <v-file-input
              v-model="reviewImages"
              label="File input"
              prepend-icon="mdi-camera"
              variant="underlined"
              accept="image/*"
              multiple
          />
          <div
              v-if="Array.isArray(reviewImages) && reviewImages.length"
              class="d-flex justify-center">
            <v-img
                v-for="(image, index) in reviewImages"
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
              :model-value="reviewRating"
              active-color="yellow-darken-2"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="red-lighten-1" @click="reviewDialog = false">취소</v-btn>
          <v-btn color="green-darken-1" @click="submitReview">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "BookList",
  data() {
    return {
      books: [
        {
          id: 1,
          cafeName: "스타벅스",
          period: "2025-01-15 05:00 ~ 07:00",
          address: "서울시 강남구",
          headcount: 2,
          payment: 10000,
          paymentNumber: "123456789",
          status: "이용 중",
          isCancellable: true,
          isReviewable: false,
        },
        {
          id: 2,
          cafeName: "스타벅스 2호",
          period: "2025-01-15 05:00 ~ 07:00",
          address: "서울시 강남구",
          headcount: 2,
          payment: 10000,
          paymentNumber: "987654321",
          status: "이용 완료",
          isCancellable: false,
          isReviewable: true,
        },
        {
          id: 3,
          cafeName: "스타벅스 3호",
          period: "2025-01-15 05:00 ~ 07:00",
          address: "서울시 강남구",
          headcount: 2,
          payment: 10000,
          paymentNumber: "123456789",
          status: "대기 중",
          isCancellable: true,
          isReviewable: false,
        },
        {
          id: 4,
          cafeName: "스타벅스 4호",
          period: "2025-01-15 05:00 ~ 07:00",
          address: "서울시 강남구",
          headcount: 2,
          payment: 10000,
          paymentNumber: "123456789",
          status: "승인 완료",
          isCancellable: true,
          isReviewable: false,
        },
      ],
      cancelDialog: false,
      reviewDialog: false,
      cancelInfo: {},
      reviewInfo: {},
      reviewContent: "",
      reviewImages: [],
      reviewRating: 3,
    };
  },
  methods: {
    createImageUrl(file) {
      if (file instanceof File) {
        return URL.createObjectURL(file);
      }
      return '';
    },
    revokeImageUrl(file) {
      if (file instanceof File) {
        URL.revokeObjectURL(file);
      }
    },
    confirmCancel(book) {
      this.cancelInfo = book;
      this.cancelDialog = true;
    },
    cancelBooking() {
      // 예약 취소 API 호출
      const payload = {
        id: this.cancelInfo.id,
        nickname: "사용자 닉네임", // 사용자 닉네임 정보 제공
      };
      this.$axios.post(`/book/${this.cancelInfo.id}`, payload)
          .then(() => {
            alert("예약이 취소되었습니다.");
            this.cancelDialog = false;
          })
          .catch((error) => {
            console.error(error);
            alert("예약 취소에 실패했습니다.");
          });
    },
    openReviewModal(book) {
      this.reviewInfo = book;
      this.reviewDialog = true;
    },
    submitReview() {
      if (!this.reviewContent.trim()) {
        alert("리뷰 내용을 입력해주세요.");
        return;
      }
      // 리뷰 작성 API 호출
      console.log("리뷰 제출", {
        id: this.reviewInfo.id,
        review: this.reviewContent,
        rating: this.reviewRating,
        images: this.reviewImages,
      });
      alert("리뷰가 작성되었습니다.");
      this.reviewDialog = false;
      this.reviewContent = "";
    },
  },
};
</script>