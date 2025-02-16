<template>
  <v-navigation-drawer
      :width="300"
  >
    <v-list
        color="transparent" mandatory>
      <v-list-item>
        <template v-slot:title>
          <span class="text-h4 font-weight-bold"> 관리자페이지 </span>
        </template>
        <template v-slot:subtitle>
          <span class="text-h6"> {{ adminPageState.getSelectedMenu }} </span>
        </template>
      </v-list-item>

      <v-list-item
          :prepend-avatar=image
          :title=username
          lines="two"
      ></v-list-item>

      <v-divider></v-divider>

      <v-list-item
          v-for="menu in adminPageState.menus"
          :key="menu.id"
          :value="menu.title"
          :prepend-icon="menu.icon"
          color="primary"
          variant="plain"
          :active="menu.title === adminPageState.getSelectedMenu"
          @click="adminPageState.selectMenu(menu.title)"
      >
        <template v-slot:title>
          <span class="menu-title"> {{ menu.title }} </span>
        </template>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block> 로그아웃 </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import defaultImage from "@/assets/images/basic-user-img.png";
import { useAdminStore } from "@/stores/adminStore";
import { useAdminPageStateStore } from "@/stores/adminPageStateStore";

export default {
  name: "AdminHeaderComponent",
  components: {
  },
  props: {
  },
  data() {
    return {
      admin: useAdminStore(),
      adminPageState: useAdminPageStateStore(),
      image: defaultImage,
      subtitle: "카페 관리",
      username: "관리자",
    }
  }
}
</script>

<style scoped>
.menu-title {
  font-size: 1.1rem;
}
</style>