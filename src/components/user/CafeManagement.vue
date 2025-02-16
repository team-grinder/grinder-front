<template>
  <div class="text-center">
    <v-chip
        class="ma-2"
        color="primary"
        @click="handleChangeView('BookManagement')"
        label>
      <v-icon icon="mdi-account-circle-outline" start></v-icon>
      예약 관리
    </v-chip>

    <v-chip
        class="ma-2"
        color="pink"
        @click="handleChangeView('ChangeCafeInfo')"
        label>
      <v-icon icon="mdi-label" start></v-icon>
      카페 정보 변경
    </v-chip>
  </div>

  <component
      :is="currentView"
      :cafe-id="cafeId"
      class="mx-auto"
      style="width: 1200px">
  </component>
</template>

<script>
import ChangeCafeInfo from "@/components/user/ChageCafeInfo.vue";
import BookManagement from "@/components/user/BookMangement.vue";
export default {
  name: "CafeManagement",
  components: {
    ChangeCafeInfo,
    BookManagement,
  },
  data() {
    return {
      currentView: "BookManagement",
      cafeId: null
    };
  },
  created() {
    const id = this.$route.params.id;
    if (id && !isNaN(id)) {
      this.cafeId = Number(id);
      console.log('CafeManagement cafeId:', this.cafeId);
    } else {
      console.error('Invalid cafe ID:', id);
    }
  },
  methods: {
    handleChangeView(view) {
      this.currentView = view;
    },
  },
};

</script>

<style scoped>

</style>