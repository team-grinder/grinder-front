<template>
  <div>
    <business-hours-setting
        :cafe-id="cafeId"
        ref="businessHours"
    />

    <time-slots-setting
        :cafe-id="cafeId"
        ref="timeSlots"
    />
  </div>
</template>

<script>
import BusinessHoursSetting from '../cafe/BusinessHoursSetting';
import TimeSlotsSetting from '../cafe/TimeSlotsSetting';

export default {
  name: 'ChangeCafeInfo',
  components: {
    BusinessHoursSetting,
    TimeSlotsSetting
  },
  props: {
    cafeId: {
      type: Number,
      required: true
    }
  }
}
</script>