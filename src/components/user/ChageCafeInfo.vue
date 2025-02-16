<template>
  <v-container>
    <v-row justify="center" class="mb-6">
      <v-col cols="12" class="text-center">
        <v-btn-toggle v-model="selectedSetting" mandatory>
          <v-btn value="businessHours">영업시간 설정</v-btn>
          <v-btn value="timeSlots">타임슬롯 설정</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <BusinessHoursSetting
        v-if="selectedSetting === 'businessHours'"
        :cafe-id="cafeId"
    />

    <TimeSlotsSetting
        v-if="selectedSetting === 'timeSlots'"
        :cafe-id="cafeId"
    />
  </v-container>
</template>

<script>
import BusinessHoursSetting from "@/components/cafe/BusinessHoursSetting.vue"
import TimeSlotsSetting from "@/components/cafe/TimeSlotsSetting.vue"
export default {
  name: 'ChangeCafeInfo',
  components: {
    BusinessHoursSetting,
    TimeSlotsSetting
  },
  props: {
    cafeId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selectedSetting: 'businessHours'
    }
  }
}
</script>