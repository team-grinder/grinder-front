<template>
  <div>
    <Swiper />
    <CafeList />
  </div>
</template>

<script>
import Swiper from "@/components/main/Swiper.vue";
import CafeList from "@/components/cafe/CafeCard.vue";
import { useUserStore } from "@/stores/userStore";

export default {
  name: "HomePage",
  components: {
    Swiper,
    CafeList,
  },
  data() {
    return {
    };
  },
  async mounted() {
    const userStore = useUserStore();
    await userStore.checkSession();
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    userId() {
      return this.userStore.id;
    },
    isAuthenticated() {
      return this.userStore.isAuthenticated;
    },
    nickname() {
      return this.userStore.nickname;
    },
    imageUrl() {
      return this.userStore.imageUrl;
    },
  },
};
</script>