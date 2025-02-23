<template>
  <Header></Header>
  <Component
      :is="currentView"
  ></Component>
</template>

<script>
import Header from "@/components/admin/Header.vue"
import CafeManage from "@/components/admin/CafeManage.vue"
import MemberManage from "@/components/admin/MemberManage.vue";
import { useUserStore } from "@/stores/userStore";
import { useAdminPageStateStore } from "@/stores/adminPageStateStore";

export default {
  name: "AdminPage",
  components: {
    Header,
    CafeManage,
    MemberManage,
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
      this.currentView = newVal.component;
    },
  },
}

</script>

<style scoped>

</style>