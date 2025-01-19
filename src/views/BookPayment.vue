<template>
  <v-container>
    <v-card class="pa-6" elevation="2">
      <v-card-title class="text-h5">예약 결제</v-card-title>
      <v-divider class="my-3"></v-divider>

      <v-list>
        <v-list-item>
          <v-list-item-title>예약 날짜:</v-list-item-title>
          <v-list-item-subtitle>{{ reservationDate }}</v-list-item-subtitle>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>예약 시간:</v-list-item-title>
          <v-list-item-subtitle>{{ formattedTime }}</v-list-item-subtitle>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>인원 수:</v-list-item-title>
          <v-list-item-subtitle>{{ selectedPersons }} 명</v-list-item-subtitle>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>총 결제 금액:</v-list-item-title>
          <v-list-item-subtitle class="text-primary font-weight-bold">
            {{ totalPrice.toLocaleString() }} 원
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <v-divider class="my-4"></v-divider>

      <!-- 결제 UI 렌더링 영역 -->
      <div id="payment-method" class="my-5"></div>

      <!-- 약관 UI 렌더링 영역 -->
      <div id="agreement" class="my-5"></div>

      <v-btn color="blue darken-1" class="mt-3" large :disabled="!isReadyToPay" @click="processPayment">
        결제하기
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

export default {
  props: {
    memberId: String,
    reservationDate: String,
    selectedTimes: Array,
    selectedPersons: Number,
    totalPrice: Number,
  },
  data() {
    return {
      tossPayments: null,
      widgets: null,
      isReadyToPay: false,
    };
  },
  computed: {
    formattedTime() {
      return this.selectedTimes.length > 1
          ? `${this.selectedTimes[0]}:00 - ${this.selectedTimes[this.selectedTimes.length - 1]}:00`
          : `${this.selectedTimes[0]}:00`;
    },
  },
  async mounted() {
    await this.initializeTossPayments();
  },
  methods: {
    async initializeTossPayments() {
      try {
        this.tossPayments = await loadTossPayments("test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm");

        const customerKey = `${this.memberId}-${crypto.randomUUID()}`;

        this.widgets = this.tossPayments.widgets({ customerKey });

        // 결제 금액 설정
        await this.widgets.setAmount({
          currency: "KRW",
          value: this.totalPrice,
        });

        // 결제 UI 렌더링
        await this.widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        });

        // 약관 렌더링
        await this.widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        });

        this.isReadyToPay = true;
      } catch (error) {
        console.error("결제 위젯 초기화 실패:", error);
        alert("결제 위젯을 불러오는 데 실패했습니다. 다시 시도해 주세요.");
      }
    },
    async processPayment() {
      try {
        await this.widgets.requestPayment({
          orderId: `order_${new Date().getTime()}`,
          orderName: `카페 예약 (${this.reservationDate})`,
          successUrl: `${window.location.origin}/payment/success`,
          failUrl: `${window.location.origin}/payment/fail`,
          customerName: "테스트 사용자",
        });
      } catch (error) {
        if (error.code === "USER_CANCEL") {
          alert("사용자가 결제를 취소했습니다.");
        } else {
          alert(`결제에 실패했습니다: ${error.message}`);
        }
      }
    },
  },
};
</script>

<style scoped>

</style>