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
      dropdownOptions: [
        { value: "all", label: "전체" },
        { value: "cafe", label: "카페" },
        { value: "feed", label: "피드" },
        { value: "member", label: "회원" },
      ],
    };
  },
};
</script>