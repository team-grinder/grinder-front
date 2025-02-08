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

    <FeedWriteDialog
        v-model="reviewDialog"
        feedTitle="리뷰작성"
        :is-create="true"
        :reviewInfo="reviewInfo"
        :reviewContent="reviewContent"
        :reviewImages="reviewImages"
        :reviewRating="reviewRating"
        @submit="submitFeed"
    />

  </v-container>
</template>

<script>
import $axios from "@/plugins/axios";
import router from "@/router";
import FeedWriteDialog from "@/components/cafe/FeedWriteDialog";

export default {
  name: "BookList",
  components: {
    FeedWriteDialog,
  },
  props: {
    userId: {
      type: Number,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      books: [
        {
          id: 1,
          cafeId: 1,
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
          cafeId: 2,
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
          cafeId: 3,
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
          cafeId: 4,
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
    confirmCancel(book) {
      this.cancelInfo = book;
      this.cancelDialog = true;
    },
    cancelBooking() {
      // 예약 취소 API 호출
      const payload = {
        id: this.cancelInfo.id,
        nickname: this.nickname,
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
    submitFeed(payload) {
      // FormData 객체 생성
      const formData = new FormData();
      formData.append('memberId', this.userId);
      formData.append('bookId', this.reviewInfo.id);
      formData.append('cafeId', this.reviewInfo.cafeId);
      formData.append("content", payload.content);
      formData.append("grade", payload.rating);

      // 파일 데이터 추가 (여러 파일일 경우 반복문 사용)
      if (payload.images && payload.images.length > 0) {
        payload.images.forEach(file => {
          formData.append("images", file);
        });
      }

      // axios로 multipart/form-data 요청 전송
      $axios.post('feed/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then(response => {
            console.log("Feed 생성 성공", response.data);

            this.reviewDialog = false;

            router.push({ name: 'UserInformation', query: { view: 'BookList' } });


          })
          .catch(error => {
            console.error("Feed 생성 실패", error);
          });
    },
  },
};
</script>