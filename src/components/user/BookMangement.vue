<template>
  <v-list lines="two">
    <v-list-subheader inset class="font-weight-bold text-h6">예약 관리</v-list-subheader>

    <v-list-item
        v-for="folder in folders"
        :key="folder.id"
        :title="'예약자명 : ' + folder.booker"
        :subtitle="'날짜' + folder.date + ' / 예약 상태 : ' + (folder.isApproved ? '승인' : '대기중') + ' / 예약 번호 : ' + folder.id + ' / 결제 금액 : ' + folder.payment"
    >
      <template v-slot:prepend>
        <v-avatar color="grey-lighten-1">
          <v-icon color="white">mdi-folder</v-icon>
        </v-avatar>
      </template>

      <template v-if="!folder.isApproved" v-slot:append>
        <v-btn
            color="green-darken-1 mr-2"
            variant="tonal"
            @click="approveBooking(folder.id)"
        >
          승인
        </v-btn>
        <v-btn
            color="red-lighten-1"
            variant="tonal"
            @click="rejectBooking(folder.id)"
        >
          거절
        </v-btn>
      </template>
    </v-list-item>
  </v-list>
</template>

<script>
import $axios from "@/plugins/axios";

export default {
  name : "BookMangement",
  data() {
    return {
      folders: [
        {
          id: 1,
          booker: 'Recipes',
          date: '2024-01-10',
          payment: 10000,
          isApproved: false,
        },
        {
          id: 2,
          booker: 'Recipes',
          date: '2024-01-10',
          payment: 10000,
          isApproved: false,
        },
        {
          id: 3,
          booker: 'Work',
          date: '2024-01-10',
          payment: 10000,
          isApproved: true,
        },
      ],
    }
  },
  methods: {
    approveBooking(id) {
      const response = $axios.put(`/book/${id}`);
      alert('예약이 승인되었습니다.');
      console.log(response);
    },
    rejectBooking(id) {
      const response = $axios.delete(`/book/${id}`);
      alert('예약이 거절되었습니다.');
      console.log(response);
    }
  }
}
</script>

<style scoped>

</style>