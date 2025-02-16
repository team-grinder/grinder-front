<template>
  <Header></Header>
  <Component
      :is="currentView"
  ></Component>
</template>

<script>
import Header from "@/components/admin/Header.vue"
import List from "@/components/admin/DataList.vue"
import { useUserStore } from "@/stores/userStore";
import { useAdminPageStateStore } from "@/stores/adminPageStateStore";

export default {
  name: "AdminPage",
  components: {
    Header,
    List,
  },
  data() {
    return {
      userStore: useUserStore(),
      adminPageState: useAdminPageStateStore(),
      currentView: "List",
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