<template>
  <div class="text-center">
    <v-chip class="ma-2" color="primary" @click="handleChangeView('BookManagement')" label>
      <v-icon icon="mdi-account-circle-outline" start></v-icon>
      예약 관리
    </v-chip>
    <v-chip class="ma-2" color="pink" @click="handleChangeView('ChangeCafeInfo')" label>
      <v-icon icon="mdi-label" start></v-icon>
      카페 정보 변경
    </v-chip>
    <component :is="currentView" :cafe-id="cafeId" class="mx-auto" style="width: 1200px">
    </component>
  </div>
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
  props: {
    id: [String, Number]
  },
  data() {
    return {
      currentView: "BookManagement",
      cafeId: null
    };
  },
  methods: {
    handleChangeView(view) {
      this.currentView = view;
      this.$router.replace({
        query: { ...this.$route.query, view }
      });
    },
  },
  created() {
    const id = this.id || this.$route.params.id;
    if (id && !isNaN(id)) {
      this.cafeId = Number(id);
    } else {
      console.error('Invalid cafe ID:', id);
      this.$router.push({ name: 'UserCafeManagerList' });
    }
    const view = this.$route.query.view;
    if (view === 'BookManagement' || view === 'ChangeCafeInfo') {
      this.currentView = view;
    }
  }
};
</script>