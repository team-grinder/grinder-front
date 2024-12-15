<template>
  <div class="date-selector">
    <!-- 년도와 월 선택 드롭다운 -->
    <div class="year-month-selector">
      <div class="dropdown">
        <Multiselect
            v-model="currentYear"
            :options="yearRange"
            placeholder="선택"
        />
        <span>년</span>
      </div>

      <div class="dropdown">
        <Multiselect
            v-model="currentMonth"
            :options="months"
            placeholder="선택"
        />
        <span>월</span>
      </div>
    </div>

    <!-- 일자 선택 버튼 -->
    <div class="date-list">
      <div
          v-for="(day, index) in daysInMonth"
          :key="index"
          :class="{ selected: selectedDate === day, disabled: isDisabled(day) }"
          class="date-item"
          @click="!isDisabled(day) && selectDate(day)"
      >
        {{ day }}
      </div>
    </div>

    <!-- 시간대 선택 -->
    <div class="time-range-selector" v-if="selectedDate">
      <h3>시간대 선택</h3>
      <div class="time-range">
        <div
            v-for="hour in 24"
            :key="hour"
            :class="{
            available: availableTimes.includes(hour),
            selected: isTimeInRange(hour),
            disabled: !availableTimes.includes(hour)
          }"
            class="time-block"
            @click="selectTime(hour)"
        >
          {{ hour }}:00
        </div>
      </div>
    </div>

    <!-- 인원 선택 -->
    <div class="guests">
      <h3>인원 선택</h3>
      <div class="guest-options">
        <button
            v-for="num in guestOptions"
            :key="num"
            :class="{ active: num === selectedGuests }"
            @click="selectGuests(num)"
        >
          {{ num }}
        </button>
      </div>
    </div>

    <!-- 예약 버튼 -->
    <button
        class="reserve-button"
        :disabled="!selectedDate || !startTime || !endTime"
        @click="makeReservation"
    >
      예약 하기
    </button>
  </div>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";

export default {
  name: "ReserveDateList",
  components: {
    Multiselect,
  },
  data() {
    return {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      selectedDate: null,
      months: Array.from({ length: 12 }, (_, i) => i + 1),
      today: new Date(), // 오늘 날짜 저장
      availableTimes: [], // 예약 가능한 시간대
      startTime: null, // 시작 시간
      endTime: null, // 끝 시간

      selectedGuests: 1, // 선택된 인원
      guestOptions: [1, 2, 3, 4], // 선택 가능한 인원 옵션

      timeRangeDummyData: [1, 2, 3, 8, 9, 10], // 더미 데이터
    };
  },
  computed: {
    yearRange() {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 3 }, (_, i) => currentYear - 1 + i);
    },
    daysInMonth() {
      const days = new Date(this.currentYear, this.currentMonth, 0).getDate();
      return Array.from({ length: days }, (_, i) => i + 1);
    },
  },
  methods: {
    isDisabled(day) {
      const selectedDate = new Date(
          this.currentYear,
          this.currentMonth - 1,
          day
      );
      return selectedDate < this.today.setHours(0, 0, 0, 0); // 오늘 이전 날짜
    },
    selectDate(day) {
      this.selectedDate = day;
      this.fetchAvailableTimes(day); // 더미 데이터를 가져옴
    },
    // 여기서부터 변경사항
    selectTime(hour) {
      if (!this.availableTimes.includes(hour)) return;

      if (!this.startTime) {
        // 시작 시간이 선택되지 않았다면 시작 시간 설정
        this.startTime = hour;
        this.endTime = null; // 끝 시간 초기화
      } else if (!this.endTime) {
        // 끝 시간이 선택되지 않았다면 끝 시간 설정
        if (hour > this.startTime && this.isRangeAvailable(this.startTime, hour)) {
          this.endTime = hour;
        } else {
          alert("선택한 범위에 예약 불가능한 시간이 포함되어 있습니다.");
          this.startTime = null;
          this.endTime = null;
        }
      } else {
        // 시작 시간과 끝 시간이 모두 설정된 경우 초기화
        this.startTime = hour;
        this.endTime = null;
      }
    },
    isRangeAvailable(start, end) {
      // 시작 시간과 끝 시간 사이에 예약 불가능한 시간이 있는지 확인
      for (let i = start; i <= end; i++) {
        if (!this.availableTimes.includes(i)) return false;
      }
      return true;
    },
    isTimeInRange(hour) {
      // 시간대가 선택된 범위에 포함되는지 확인
      return this.startTime !== null && this.endTime !== null && hour >= this.startTime && hour <= this.endTime;
    },
    fetchAvailableTimes(day) {
      // 예약 가능한 시간대를 계산 (24시간 중 예약 불가능한 시간을 제외)
      day + 1;
      const allTimes = Array.from({ length: 24 }, (_, i) => i); // 0~23까지의 시간 생성
      this.availableTimes = allTimes.filter(
          (hour) => !this.timeRangeDummyData.includes(hour)
      );
      // 시간대 선택 초기화
      this.startTime = null;
      this.endTime = null;
    },
    makeReservation() {
      if (!this.selectedDate) {
        alert("날짜와 시간을 모두 선택해주세요.");
        return;
      }
      alert(
          `예약 완료: ${this.currentYear}년 ${this.currentMonth}월 ${this.selectedDate}일\n` +
          `시간: ${this.startTime}시부터 ${this.endTime}까지\n` +
          `인원: ${this.selectedGuests}명`
      );
    },
    // 인원 선택
    selectGuests(num) {
      this.selectedGuests = num;
    },
  },
};
</script>

<style scoped>
.date-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1em;
}

/* Multiselect 공통 스타일 조정 */
.multiselect {
  width: 120px; /* 너비 설정 */
  font-size: 1rem; /* 글자 크기 설정 */
}

.multiselect__input,
.multiselect__single,
.multiselect__placeholder {
  font-size: 1rem; /* 입력 필드, 선택된 항목, placeholder 글자 크기 */
  padding: 8px 12px; /* 내부 여백 설정 */
}

.multiselect__tags {
  min-height: 40px; /* 셀렉트박스의 높이 설정 */
}

/* 부모 컨테이너 */
.year-month-selector {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 일자 리스트 */
.date-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.date-item {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10%;
  transition: all 0.3s;
}

.date-item:hover {
  background-color: #00a862;
  color: white;
}

.date-item.selected {
  background-color: #00a862;
  color: white;
}

.date-item.disabled {
  background-color: #f0f0f0;
  color: #aaa;
  cursor: not-allowed;
}

/* 시간대 선택 */
.time-range-selector {
  text-align: center;
}

.time-range {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.time-block {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 40px;
  background-color: #f0f0f0;
  color: #aaa;
  cursor: not-allowed;
  border-radius: 5px;
  transition: all 0.3s;
}

.time-block.available {
  background-color: #e0ffe0;
  color: #000;
  cursor: pointer;
}

.time-block.available:hover {
  background-color: #00a862;
  color: white;
}

.time-block.selected {
  background-color: #00a862;
  color: white;
}

/* 인원 선택 */
.guests {
  text-align: center;
}

.guest-options button {
  margin: 5px;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 50%;
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.guest-options button.active {
  background-color: #00a862;
  color: white;
}

/* 예약 버튼 */
.reserve-button {
  padding: 10px 20px;
  background-color: #00a862;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
</style>