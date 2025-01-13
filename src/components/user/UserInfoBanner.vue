<template>
  <!-- 배너 전체를 감싸는 카드 -->
  <v-card
      max-width="1200"
      class="mx-auto my-4 pa-0 cafe-info-banner"
      elevation="3"
      rounded="lg"
  >
    <!-- 카페 배경 이미지 -->
    <v-img
        src=""
        height="150"
        cover
        gradient="to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)"
        class="cafe-info-banner__image"
    >
      <v-container fill-height class="pa-0">
        <v-row
            align="center"
            justify="start"
            class="fill-height ma-0"
        >
          <!-- 왼쪽: 회원 프로필 -->
          <v-col
              cols="auto"
              class="d-flex justify-center"
          >
            <v-avatar
                size="128"
                class="cafe-info-banner__logo"
            >
              <v-img
                  :src="!!imageUrl ? imageUrl : defaultUserImage"
                  alt="카페 로고"
                  cover
              ></v-img>
            </v-avatar>
          </v-col>

          <!-- 오른쪽: 카페 상세 정보 -->
          <v-col
              class="text-white"
              cols="auto"
          >
            <h2 class="cafe-info-banner__name">
              {{ nickname }}
            </h2>

            <div>
              <strong>등급</strong> : {{ tier }}
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-img>
  </v-card>
</template>

<script>
import defaultImage from "@/assets/images/basic-user.png";

export default {
  name: "UserInfoBanner",
  data() {
    return {
    defaultUserImage: defaultImage,
    }
  },
  props: {
    nickname: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    tier: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>

</style>