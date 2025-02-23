<template>
  <Header></Header>
  <Component
      :is="currentView"
  ></Component>
</template>

<script>
import Header from "@/components/admin/Header.vue"
import CafeManage from "@/components/admin/CafeManage.vue"
import { useUserStore } from "@/stores/userStore";
import { useAdminPageStateStore } from "@/stores/adminPageStateStore";

export default {
  name: "AdminPage",
  components: {
    Header,
    CafeManage,
  },
  data() {
    return {
      userStore: useUserStore(),
      adminPageState: useAdminPageStateStore(),
      currentView: "CafeManage",
    };
  },
  watch: {
    // adminPageState의 selectedMenu에 따라 컴포넌트를 변경
    "adminPageState.selectedMenu": function (newVal) {
      console.log(newVal);
    },
  },
}

</script>

<style scoped>

</style>