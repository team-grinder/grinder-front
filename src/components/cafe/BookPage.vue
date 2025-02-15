<template>
  <v-container class="mx-auto" width="1200">
    <v-row justify="space-around">
      <v-date-picker
          v-model="date"
          title="예약일 조회"
          header="날짜를 선택해주세요"
          color="green darken-1"
          width="1200"
          :min="minDate"
          :max="maxDate"
          @update:modelValue="fetchAvailableTimes"
      ></v-date-picker>
    </v-row>
    <v-row v-if="!!availableTimes"
           class="flex-column"
           justify="center">
      <v-container>
        <div class="font-weight-bold mb-2 text-h6">시간을 선택해 주세요.</div>

        <v-btn
            v-for="time in allTimes"
            :key="time"
            class="ma-1"
            :disabled="checkTime(time)"
            :active="selectedTimes.includes(time)"
            @click="toggleTimeSelection(time)"
        >
          {{ time }}:00
        </v-btn>

        <!-- 인원 선택 버튼 -->
        <div class="font-weight-bold my-2 text-h6">
          인원을 선택해 주세요.
          <p class="text-caption text-grey">
            * 인원 당 {{ cafeBookInfo.perPerson }} 원, 최소 결제 금액 {{ cafeBookInfo.minPayment }} 원, 최대 인원 {{ cafeBookInfo.maxPerson }} 명
          </p>
        </div>
        <v-btn
            v-for="person in cafeBookInfo.maxPerson"
            :icon="`mdi-numeric-${person}`"
            :key="person"
            class="ma-1"
            :active="selectedPersons === person"
            border
            variant="text"
            @click="selectPersons(person)"
        >
        </v-btn>

        <!-- 총 결제 금액 -->
        <div class="font-weight-bold my-10 text-h6">
          총 결제 금액: <span class="text-primary">{{ totalPrice.toLocaleString() }} 원</span>
        </div>

        <!-- 결제 버튼 -->
        <v-btn color="green darken-1" class="mt-4" :disabled="!canProceedToPayment" @click="goToPayment">
          결제하기
        </v-btn>

      </v-container>
    </v-row>
  </v-container>
</template>

<script>
import axios from '@/plugins/axios';

export default {
  props: {
    memberId: String,
    isAuthenticated: Boolean,
  },
  data() {
    return {
      date: "",
      minDate: new Date(new Date().setDate(new Date().getDate() - 1)), // 오늘 날짜
      maxDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 한달 뒤까지
      allTimes: null,
      availableTimes: null,
      cafeBookInfo: null,
      selectedTimes: [],
      selectedPersons: 0, // 선택한 인원 수
      selectingStartTime: null, // 시작 시간 추적
    };
  },
  computed: {
    // 총 결제 금액 계산 (인원 * 인당 가격)
    totalPrice() {
      return this.selectedPersons * (this.cafeBookInfo ? this.cafeBookInfo.perPerson : 0);
    },
    // 최소 결제 금액 기준 만족 여부
    canProceedToPayment() {
      return this.totalPrice >= (this.cafeBookInfo ? this.cafeBookInfo.minPayment : 0) && this.selectedPersons > 0;
    },
  },
  methods: {
    async fetchAvailableTimes() {
      if (!this.date) return;

      try {
        const tablingResponse = await axios.get(`/tabling/cafe/${this.$route.params.id}/tabling-info`, {params: {date: this.formatDate(this.date)}});
        const cafeInfoResponse = await axios.get(`/cafe/${this.$route.params.id}`);
        const businessHoursResponse = await axios.get(`/cafe/${this.$route.params.id}/business-hours`);

        this.availableTimes = {
          startTime: businessHoursResponse.data.startTime,
          endTime: businessHoursResponse.data.endTime,
          maxTime: businessHoursResponse.data.maxTime,
          invalidList: businessHoursResponse.data.invalidList || []
        };

        this.cafeBookInfo = {
          perPerson: cafeInfoResponse.data.perPerson || 5000,
          minPayment: cafeInfoResponse.data.minPayment || 20000,
          maxPerson: cafeInfoResponse.data.maxPerson || 7
        };

        this.allTimes = Array.from(
            { length: this.availableTimes.endTime - this.availableTimes.startTime + 1 },
            (_, i) => i + this.availableTimes.startTime
        );

        const unavailableTimes = tablingResponse.data.timeSlots
            .filter(slot => !slot.available)
            .map(slot => parseInt(slot.time.split(':')[0]));

        this.availableTimes.invalidList = [...this.availableTimes.invalidList, ...unavailableTimes];

      } catch (error) {
        console.error("시간 정보를 불러오는 데 실패했습니다.", error);
      }
    },
    toggleTimeSelection(time) {
      if (this.availableTimes.invalidList.includes(time)) {
        alert("선택할 수 없는 시간입니다. 다시 선택하세요.");
        this.resetSelection();
        return;
      }

      if (this.selectingStartTime === null) {
        // 시작 시간을 선택한 경우
        this.selectingStartTime = time;
        this.selectedTimes = [time];
      } else {
        // 종료 시간을 선택한 경우
        if (time < this.selectingStartTime) {
          alert("시작 시간보다 이후의 시간을 선택하세요.");
          return;
        }

        // 선택 범위 내에 비활성화 시간이 있는지 확인
        const range = this.allTimes.slice(
            this.allTimes.indexOf(this.selectingStartTime),
            this.allTimes.indexOf(time) + 1
        );

        if (range.some((t) => this.availableTimes.invalidList.includes(t))) {
          alert("선택한 범위 내에 예약이 불가능한 시간이 포함되어 있습니다.");
          this.resetSelection();
          return;
        }

        // 선택 범위가 maxTime 초과 여부 확인
        if (range.length > this.availableTimes.maxTime) {
          alert(`최대 ${this.availableTimes.maxTime}시간까지만 예약할 수 있습니다.`);
          this.resetSelection();
          return;
        }

        // 범위 내의 시간 선택 적용
        this.selectedTimes = range;
        this.selectingStartTime = null; // 초기화하여 새로운 선택 시작 가능
      }
    },

    resetSelection() {
      this.selectedTimes = [];
      this.selectingStartTime = null;
    },

    selectPersons(person) {
      this.selectedPersons = person;
    },
    checkTime(time) {
      return this.availableTimes.invalidList.includes(time);
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    async goToPayment() {
      try {
        const time = String(this.selectedTimes[0]).padStart(2, '0');
        const formattedTime = `${time}:00:00`;

        localStorage.setItem('pendingReservation', JSON.stringify({
          cafeId: this.$route.params.id,
          memberId: this.memberId,
          date: this.formatDate(this.date),
          reserveTime: formattedTime,
          numberOfGuests: this.selectedPersons,
          totalPrice: this.totalPrice
        }));

        await this.$router.push({
          path: '/payment',
          query: {
            reservationDate: this.formatDate(this.date),
            selectedTimes: this.selectedTimes.join(','),
            selectedPersons: this.selectedPersons,
            totalPrice: this.totalPrice
          }
        });
      } catch (error) {
        console.error("결제 페이지 이동 실패", error);
        alert("결제 페이지로 이동할 수 없습니다. 다시 시도해주세요.");
      }
    },
  },
};
</script>

<style scoped>

</style>