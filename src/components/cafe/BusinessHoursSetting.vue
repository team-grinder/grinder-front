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
                label="시작 시간"
                :disabled="!isEditing"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-select
                v-model="businessHours.endTime"
                :items="timeOptions"
                label="종료 시간"
                :disabled="!isEditing"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
                v-model="businessHours.maxTimePerReservation"
                label="최대 예약 가능 시간 (시간)"
                type="number"
                :disabled="!isEditing"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
          color="primary"
          @click="isEditing ? saveBusinessHours() : startEditing()"
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
      type: String,
      required: true
    }
  },
  data() {
    return {
      isEditing: false,
      businessHours: {
        startTime: null,
        endTime: null,
        maxTimePerReservation: 0
      },
      timeOptions: Array.from({ length: 24 }, (_, i) => ({
        text: `${String(i).padStart(2, '0')}:00`,
        value: i
      }))
    }
  },
  methods: {
    async fetchBusinessHours() {
      try {
        const response = await axios.get(`/admin/cafe/${this.cafeId}/business-hours`);
        this.businessHours = {
          startTime: response.data.startTime,
          endTime: response.data.endTime,
          maxTimePerReservation: response.data.maxTime
        };
      } catch (error) {
        console.error('영업시간 조회 실패:', error);
      }
    },
    startEditing() {
      this.isEditing = true;
    },
    async saveBusinessHours() {
      try {
        await axios.put(`/admin/cafe/${this.cafeId}/business-hours`, this.businessHours);
        this.isEditing = false;
        await this.fetchBusinessHours();
      } catch (error) {
        console.error('영업시간 저장 실패:', error);
      }
    }
  },
  created() {
    this.fetchBusinessHours();
  }
}
</script>