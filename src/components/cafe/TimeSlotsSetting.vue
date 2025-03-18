<template>
  <v-card class="mb-6">
    <v-card-title class="text-h6">타임슬롯 설정</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="4">
          <v-date-picker v-model="selectedDate" @update:model-value="fetchTimeSlots"
          ></v-date-picker>
        </v-col>
        <v-col cols="8">
          <v-simple-table v-if="timeSlots.length > 0">
            <template v-slot:default>
              <thead>
              <tr>
                <th>시간</th>
                <th>최대 예약 인원</th>
                <th>현재 예약 인원</th>
                <th>예약 가능 여부</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="slot in timeSlots" :key="slot.reserveTime">
                <td>{{ formatTime(slot.reserveTime) }}</td>
                <td>
                  <v-text-field v-if="isEditing" v-model="slot.maxGuests" type="number" dense hide-details
                  ></v-text-field>
                  <span v-else>{{ slot.maxGuests }}</span>
                </td>
                <td>{{ slot.currentGuests }}</td>
                <td>
                  <v-chip :color="slot.isAvailable ? 'success' : 'error'" small>
                    {{ slot.isAvailable ? '가능' : '불가능' }}
                  </v-chip>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-alert v-else type="info" text>
            선택한 날짜의 타임슬롯이 없습니다.
          </v-alert>
        </v-col>
      </v-row>

      <!-- 알림 메시지 추가 -->
      <v-alert
          v-if="alertMessage"
          :type="alertType"
          dismissible
          @click:close="alertMessage = ''"
          class="mt-3"
      >
        {{ alertMessage }}
      </v-alert>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
          color="primary"
          @click="isEditing ? saveTimeSlots() : startEditing()"
          :loading="loading"
      >
        {{ isEditing ? '저장' : '수정' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from '@/plugins/axios';

export default {
  name: 'TimeSlotsSetting',
  props: {
    cafeId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isEditing: false,
      loading: false,
      alertMessage: '',
      alertType: 'info',
      selectedDate: new Date().toISOString().substr(0, 10),
      timeSlots: []
    }
  },
  methods: {
    formatTime(time) {
      if (typeof time === 'string' && time.includes(':')) {
        return time;
      }
      return `${String(time).padStart(2, '0')}:00`;
    },
    async fetchTimeSlots() {
      try {
        this.loading = true;
        const response = await axios.get(`/tabling/time-slots/${this.cafeId}`, {
          params: { date: this.selectedDate }
        });
        this.timeSlots = (response.data || []).map(slot => ({
          ...slot,
          reserveTime: this.formatTime(slot.reserveTime)
        }));
      } catch (error) {
        console.error('타임슬롯 조회 실패:', error);
        this.showAlert('타임슬롯 정보를 불러오는데 실패했습니다.', 'error');
      } finally {
        this.loading = false;
      }
    },
    startEditing() {
      this.isEditing = true;
    },
    async saveTimeSlots() {
      try {
        this.loading = true;
        await axios.put(`/tabling/time-slots/${this.cafeId}`, {
          date: this.selectedDate,
          timeSlots: this.timeSlots.map(slot => ({
            reserveTime: typeof slot.reserveTime === 'string' && slot.reserveTime.includes(':')
                ? slot.reserveTime + ':00'
                : this.formatTime(slot.reserveTime) + ':00',
            maxGuests: parseInt(slot.maxGuests, 10)
          }))
        });
        this.isEditing = false;
        this.showAlert('타임슬롯 설정이 저장되었습니다.', 'success');
        await this.fetchTimeSlots();
      } catch (error) {
        console.error('타임슬롯 저장 실패:', error);
        this.showAlert('타임슬롯 저장에 실패했습니다: ' + this.getErrorMessage(error), 'error');
      } finally {
        this.loading = false;
      }
    },
    // 에러 메시지 추출
    getErrorMessage(error) {
      if (error.response && error.response.data && error.response.data.message) {
        return error.response.data.message;
      }
      return error.message || '알 수 없는 오류가 발생했습니다.';
    },
    // 알림 메시지 표시
    showAlert(message, type = 'info') {
      this.alertMessage = message;
      this.alertType = type;

      // 5초 후 알림 자동 제거
      setTimeout(() => {
        this.alertMessage = '';
      }, 5000);
    }
  },
  created() {
    if (!this.cafeId) {
      console.error('카페 ID가 없습니다.');
      this.showAlert('카페 정보를 찾을 수 없습니다.', 'error');
      return;
    }
    this.fetchTimeSlots();
  }
}
</script>