<template>
  <v-container>
    <v-card
        class="bg-green-lighten-5 mx-auto mb-5"
        width="1200"
        variant="outlined"
        v-for="book in formattedBookings"
        :key="book.id"
    >
      <template v-slot:title>
        <span class="font-weight-black">{{ book.cafeName }}</span>
      </template>
      <template v-slot:subtitle>
        <span>{{ book.formattedDateTime }}</span>
      </template>

      <v-card-text class="bg-white pt-4">
        <p>주소 : <span>{{ book.address }}</span></p>
        <p>인원 : <span>{{ book.numberOfGuests }}명</span></p>
        <p>결제 비용 : <span>{{ formatPrice(book.paymentAmount) }}원</span></p>
        <p>결제 번호 : <span>{{ book.paymentId }}</span></p>
        <p>예약 상태 : <span>{{ getStatusLabel(book.status) }}</span></p>

        <v-card-actions class="d-flex justify-end">
          <v-btn
              v-if="isCancellable(book.status)"
              color="red-lighten-1"
              variant="tonal"
              @click="confirmCancel(book)"
          >
            예약 취소
          </v-btn>
          <v-btn
              v-if="isReviewable(book.status)"
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
        <v-card-title>예약 취소 확인</v-card-title>
        <v-card-text>
          <p>{{ selectedBooking?.cafeName }}에서 예약을 취소하시겠습니까?</p>
          <p>예약 번호: {{ selectedBooking?.paymentId }}</p>
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
import FeedWriteDialog from "@/components/cafe/FeedWriteDialog.vue";

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
      bookings: [],
      cancelDialog: false,
      reviewDialog: false,
      selectedBooking: null,
      cancelInfo: {},
      reviewInfo: {},
      reviewContent: "",
      reviewImages: [],
      reviewRating: 3,
    };
  },
  computed: {
    formattedBookings() {
      console.log('원본 bookings:', this.bookings);
      return this.bookings.map(booking => ({
        ...booking,
        formattedDateTime: `${booking.date} ${booking.reserveTime}`
      }));
    }
  },
  methods: {
    async fetchBookings() {
      try {
        console.log('예약 정보 조회 시작');
        const response = await $axios.get('/tabling/mypage/tabling');
        console.log('API 응답:', response);
        if (response.data.code === "200") {
          this.bookings = response.data.data;
        }
      } catch (error) {
        console.error('예약 정보 조회 실패:', error);
      }
    },
    formatPrice(price) {
      return new Intl.NumberFormat('ko-KR').format(price);
    },
    getStatusLabel(status) {
      const statusMap = {
        'PENDING': '승인 대기',
        'CONFIRMED': '예약 확정',
        'COMPLETED': '이용 완료',
        'CANCEL': '예약 취소'
      };
      return statusMap[status] || status;
    },
    isCancellable(status) {
      return ['PENDING', 'CONFIRMED'].includes(status);
    },
    isReviewable(status) {
      return status === 'COMPLETED';
    },
    confirmCancel(booking) {
      this.selectedBooking = booking;
      this.cancelDialog = true;
    },
    async cancelBooking() {
      try {
        await $axios.delete(`/tabling/${this.selectedBooking.id}`);
        await this.fetchBookings();
        this.cancelDialog = false;
      } catch (error) {
        console.error('예약 취소 실패:', error);
      }
    },
    openReviewModal(booking) {
      this.selectedBooking = booking;
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
  async created() {
    await this.fetchBookings();
  },
};
</script>