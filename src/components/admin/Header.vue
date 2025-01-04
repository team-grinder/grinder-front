<template>
  <v-navigation-drawer
      :width="300"
      class="bg-green-darken-1" theme="dark"
      permanent
  >
    <v-list
        color="transparent">
      <v-list-item
          class="text-h4 text-center"
          title="관리자 페이지"
          :subtitle=subtitle>
      </v-list-item>

      <v-list-item
          :prepend-avatar=image
          :title=username
          :subtitle=tier
          lines="two"
      ></v-list-item>

      <v-divider></v-divider>

      <v-list-item
          link title="카페 관리"
      >
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

export default {
  name: "AdminHeaderComponent",
  props: {
  },
  data() {
    return {
      image: defaultImage,
      subtitle: "카페 관리",
      username: "관리자",
      tier: "관리자",
    }
  }
}
</script>

<style scoped>

</style>