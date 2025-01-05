<template>
  <div>
    <Swiper />
    <CafeList />
  </div>
</template>

<script>
import Swiper from "@/components/main/Swiper.vue";
import CafeList from "@/components/cafe/CafeCard.vue";

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
};
</script>