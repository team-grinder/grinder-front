<template>
  <Header></Header>
  <List></List>
</template>

<script>
import Header from "@/components/admin/Header.vue"
import List from "@/components/admin/DataList.vue"
import { useUserStore } from "@/stores/userStore";

export default {
  name: "AdminPage",
  components: {
    Header,
    List,
  },
  data() {
    return {
      userStore: useUserStore(),
    };
  },
}

</script>

<style scoped>

</style>