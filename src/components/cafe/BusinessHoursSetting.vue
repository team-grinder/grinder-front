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

        <v-row v-if="isEditing">
          <v-col cols="12">
            <v-select
                v-model="businessHours.blockedTimes"
                :items="timeOptions"
                item-title="title"
                item-value="value"
                label="예약 불가 시간대"
                multiple
                chips
            ></v-select>
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
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isEditing: false,
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
  computed: {
    formattedStartTime() {
      return this.businessHours.startTime != null
          ? `${String(this.businessHours.startTime).padStart(2, '0')}:00`
          : '';
    },
    formattedEndTime() {
      return this.businessHours.endTime != null
          ? `${String(this.businessHours.endTime).padStart(2, '0')}:00`
          : '';
    }
  },
  methods: {
    async fetchBusinessHours() {
      try {
        const response = await axios.get(`/cafe/${this.cafeId}/business-hours`);
        this.businessHours = response.data;
      } catch (error) {
        console.error('영업시간 조회 실패:', error);
      }
    },
    startEditing() {
      this.isEditing = true;
    },
    async saveBusinessHours() {
      try {
        await axios.put(`/cafe-manager/cafe/${this.cafeId}/business-hours`, {
          startTime: this.businessHours.startTime,
          endTime: this.businessHours.endTime,
          maxTimePerReservation: this.businessHours.maxTimePerReservation,
          maxGuestsPerTime: this.businessHours.maxGuestsPerTime,
          blockedTimes: this.businessHours.blockedTimes
        });
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