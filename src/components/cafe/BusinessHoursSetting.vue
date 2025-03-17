<template>
  <v-card class="mb-6">
    <v-card-title class="text-h6">영업시간 설정</v-card-title>

    <v-card-text>
      <v-form ref="form">
        <v-row>
          <v-col cols="6">
            <v-select
                v-model="businessHours.startTime"
                :items="timeOptions"
                item-title="title"
                item-value="value"
                label="시작 시간"
                :disabled="!isEditing"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-select
                v-model="businessHours.endTime"
                :items="timeOptions"
                item-title="title"
                item-value="value"
                label="종료 시간"
                :disabled="!isEditing"
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <v-text-field
                v-model="businessHours.maxTimePerReservation"
                label="최대 예약 가능 시간 (분)"
                type="number"
                :disabled="!isEditing"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
                v-model="businessHours.maxGuestsPerTime"
                label="시간당 최대 수용 인원"
                type="number"
                :disabled="!isEditing"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-select
                v-model="businessHours.blockedTimes"
                :items="timeOptions"
                item-title="title"
                item-value="value"
                label="예약 불가 시간대"
                multiple
                chips
                :disabled="!isEditing"
            ></v-select>
          </v-col>
        </v-row>
      </v-form>

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
          @click="isEditing ? saveBusinessHours() : startEditing()"
          :loading="loading"
          :disabled="loading"
      >
        {{ isEditing ? '저장' : '수정' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from '@/plugins/axios';

export default {
  name: 'BusinessHoursSetting',
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
      businessHours: {
        startTime: null,
        endTime: null,
        maxTimePerReservation: 0,
        maxGuestsPerTime: 0,
        blockedTimes: []
      },
      timeOptions: Array.from({ length: 24 }, (_, i) => ({
        title: `${String(i).padStart(2, '0')}:00`,
        value: i
      }))
    }
  },
  methods: {
    async fetchBusinessHours() {
      try {
        this.loading = true;

        const response = await axios.get(`/cafe/${this.cafeId}/business-hours`);

        if (response.data) {
          console.log('영업시간 조회 응답:', response.data);
          const data = response.data;

          const startTime = data.startTime;
          const endTime = data.endTime;

          const maxTimePerReservation = data.maxTime || data.maxTimePerReservation || 0;

          const blockedTimes = data.invalidList || data.blockedTimes || [];

          this.businessHours = {
            startTime: startTime,
            endTime: endTime,
            maxTimePerReservation: maxTimePerReservation,
            maxGuestsPerTime: data.maxGuestsPerTime || 0,
            blockedTimes: blockedTimes
          };

          console.log('화면 표시용 변환 데이터:', this.businessHours);
        }
      } catch (error) {
        console.error('영업시간 조회 실패:', error);
        this.showAlert('영업시간 정보를 불러오는데 실패했습니다.', 'error');
      } finally {
        this.loading = false;
      }
    },
    startEditing() {
      this.isEditing = true;
    },
    async saveBusinessHours() {
      try {
        this.loading = true;

        const formattedData = {
          startTime: this.formatTimeForAPI(this.businessHours.startTime),
          endTime: this.formatTimeForAPI(this.businessHours.endTime),
          maxTime: parseInt(this.businessHours.maxTimePerReservation || 60, 10), // maxTimePerReservation -> maxTime
          maxGuestsPerTime: parseInt(this.businessHours.maxGuestsPerTime || 10, 10),
          invalidList: (this.businessHours.blockedTimes || []).map(time => this.formatTimeForAPI(time)) // blockedTimes -> invalidList
        };

        console.log('저장할 데이터:', formattedData);

        await axios.put(`/cafe-manager/cafe/${this.cafeId}/business-hours`, formattedData);

        this.isEditing = false;
        this.showAlert('영업시간 설정이 저장되었습니다.', 'success');

        await this.fetchBusinessHours();
      } catch (error) {
        console.error('영업시간 저장 실패:', error);
        this.showAlert('영업시간 저장에 실패했습니다.', 'error');
      } finally {
        this.loading = false;
      }
    },
    formatTimeForAPI(time) {
      if (time === null || time === undefined) {
        return null;
      }
      return `${String(time).padStart(2, '0')}:00:00`;
    },
    showAlert(message, type = 'info') {
      this.alertMessage = message;
      this.alertType = type;

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

    this.fetchBusinessHours();
  }
}
</script>