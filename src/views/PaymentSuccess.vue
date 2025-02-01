<template>
  <v-container>
    <v-card class="pa-6" elevation="2">
      <v-card-title class="text-h5 text-center">결제 완료</v-card-title>
      <v-card-text class="text-center">
        <v-progress-circular
            v-if="loading"
            indeterminate
            color="primary"
        ></v-progress-circular>
        <div v-else>
          <v-icon size="64" color="success">mdi-check-circle</v-icon>
          <h2 class="mt-4">결제가 완료되었습니다</h2>
          <div v-if="paymentInfo" class="mt-4">
            <p>주문번호: {{ paymentInfo.orderId }}</p>
            <p>결제금액: {{ formattedAmount }}원</p>
          </div>
          <v-btn color="primary" class="mt-6" @click="goToMain">메인페이지로 이동</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from '@/plugins/axios';

export default {
  data() {
    return {
      loading: true,
      paymentInfo: null
    }
  },
  computed: {
    formattedAmount() {
      if (!this.paymentInfo?.amount) return '0';
      return Number(this.paymentInfo.amount).toLocaleString();
    }
  },
  methods: {
    goToMain() {
      this.$router.push('/');
    }
  },
  async created() {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");
      const paymentType = searchParams.get("paymentType");

      // 저장된 예약 정보 가져오기
      const reservationData = JSON.parse(localStorage.getItem('pendingReservation'));
      if (!reservationData) {
        throw new Error('예약 정보를 찾을 수 없습니다.');
      }

      // 1. 예약 생성 요청
      const bookingResponse = await axios.post('/tabling', {
        cafeId: reservationData.cafeId,
        memberId: reservationData.memberId,
        date: reservationData.date,
        reserveTime: reservationData.reserveTime,
        numberOfGuests: reservationData.numberOfGuests,
        paymentId: paymentResponse.data.paymentId
      });


      // 2. 결제 승인 요청
      const paymentResponse = await axios.post('/payment/success', {
        paymentType: paymentType,
        orderId,
        paymentKey,
        amount: Number(amount),
        tablingId: bookingResponse.data.id
      });

      if (paymentResponse.data.success) {

        this.paymentInfo = {
          orderId,
          amount: amount
      };

        // 성공 후 임시 저장 데이터 삭제
        localStorage.removeItem('pendingReservation');

        // 예약 완료 페이지로 이동
        setTimeout(() => {
          this.$router.push({
            path: '/',
            query: {
              tablingId: bookingResponse.data.id,
              paymentId: paymentResponse.data.paymentId
            }
          });
        }, 2000);
      }
    } catch (error) {
      console.error('결제/예약 처리 실패:', error);
      await this.$router.push({
        path: '/error',
        query: {
          message: error.response?.data?.message || '결제/예약 처리 중 오류가 발생했습니다.'
        }
      });
    } finally {
      this.loading = false;
    }
  }
}
</script>