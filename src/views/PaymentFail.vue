<template>
  <v-container>
    <v-card class="pa-6" elevation="2">
      <v-card-title class="text-h5 text-center">결제 실패</v-card-title>
      <v-card-text class="text-center">
        <v-icon size="64" color="error">mdi-alert-circle</v-icon>
        <h2 class="mt-4">결제에 실패했습니다</h2>
        <p class="mt-2">{{ failMessage }}</p>

        <!-- 실패 상세 정보 -->
        <div v-if="failCode" class="mt-4 text-body-2 text-grey-darken-1">
          <p>실패 코드: {{ failCode }}</p>
          <p>주문번호: {{ orderId }}</p>
        </div>

        <!-- 재시도 버튼 -->
        <v-btn
            color="primary"
            class="mt-6"
            @click="retryPayment"
        >
          결제 다시 시도하기
        </v-btn>

        <!-- 홈으로 돌아가기 버튼 -->
        <v-btn
            color="grey"
            variant="text"
            class="mt-2"
            @click="goHome"
        >
          홈으로 돌아가기
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      orderId: '',
      failMessage: '',
      failCode: ''
    }
  },
  created() {
    const searchParams = new URLSearchParams(window.location.search);
    this.orderId = searchParams.get("orderId") || '';
    this.failCode = searchParams.get("code") || '';
    this.failMessage = this.getFailMessage(this.failCode);
  },
  methods: {
    retryPayment() {
      const pendingReservation = JSON.parse(localStorage.getItem('pendingReservation'));
      if (!pendingReservation) {
        alert('예약 정보가 없습니다.');
        this.goHome();
        return;
      }
      // 결제 페이지로 돌아가기
      this.$router.push(`/book/${pendingReservation.cafeId}`);
    },
    goHome() {
      localStorage.removeItem('pendingReservation');
      this.$router.push('/');
    },
    getFailMessage(code) {
      const messages = {
        'PAY_PROCESS_CANCELED': '결제가 취소되었습니다.',
        'PAY_PROCESS_ABORTED': '결제가 중단되었습니다.',
      };
      return messages[code] || '결제 처리 중 오류가 발생했습니다.';
    }
  }
}
</script>

<style scoped>
.v-card {
  max-width: 600px;
  margin: 0 auto;
}
</style>