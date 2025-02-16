<!-- TimeSlotsSetting.vue -->
<template>
  <v-card class="mb-6">
    <v-card-title class="text-h6">타임슬롯 설정</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="4">
          <v-date-picker
              v-model="selectedDate"
              @update:model-value="fetchTimeSlots"
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
              <tr v-for="slot in timeSlots" :key="slot.time">
                <td>{{ slot.time }}</td>
                <td>
                  <v-text-field
                      v-if="isEditing"
                      v-model="slot.maxGuests"
                      type="number"
                      dense
                      hide-details
                  ></v-text-field>
                  <span v-else>{{ slot.maxGuests }}</span>
                </td>
                <td>{{ slot.maxGuests - slot.availableGuests }}</td>
                <td>
                  <v-chip
                      :color="slot.isAvailable ? 'success' : 'error'"
                      small
                  >
                    {{ slot.isAvailable ? '가능' : '불가능' }}
                  </v-chip>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-alert
              v-else
              type="info"
              text
          >
            선택한 날짜의 타임슬롯이 없습니다.
          </v-alert>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
          color="primary"
          @click="isEditing ? saveTimeSlots() : startEditing()"
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
      selectedDate: new Date().toISOString().substr(0, 10),
      timeSlots: []
    }
  },
  methods: {
    async fetchTimeSlots() {
      try {
        const response = await axios.get(`/cafe/${this.cafeId}/tabling-info`, {
          params: { date: this.selectedDate }
        });
        this.timeSlots = response.data.timeSlots || [];
      } catch (error) {
        console.error('타임슬롯 조회 실패:', error);
      }
    },
    startEditing() {
      this.isEditing = true;
    },
    async saveTimeSlots() {
      try {
        const timeSlotSetting = {
          date: this.selectedDate,
          timeSlots: this.timeSlots.map(slot => ({
            reserveTime: slot.time,
            maxGuests: slot.maxGuests
          }))
        };

        await axios.put(`/admin/tabling/time-slots/${this.cafeId}`, timeSlotSetting);
        this.isEditing = false;
        await this.fetchTimeSlots();
      } catch (error) {
        console.error('타임슬롯 저장 실패:', error);
      }
    }
  },
  created() {
    this.fetchTimeSlots();
    console.log('BusinessHoursSetting cafeId:', this.cafeId);
  }
}
</script>