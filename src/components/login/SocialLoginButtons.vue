<template>
  <div>
    <div class="social-box" v-for="provider in socialProviders" :key="provider.id">
      <button :id="provider.id" @click="loginWithProvider(provider.url)">
        <img :src="provider.icon" :alt="`${provider.name}_icon`" />
        {{ provider.label }}
      </button>
    </div>
  </div>
</template>

<script>
import "@/assets/css/socialLogin.css";

export default {
  name: "SocialLoginButtons",
  data() {
    return {
      socialProviders: [
        {
          id: "google-btn",
          name: "google",
          label: "구글 계정으로 로그인",
          icon: require("@/assets/images/icon/icon_google.png"),
          url: "/oauth2/authorization/google",
        },
        {
          id: "naver-btn",
          name: "naver",
          label: "네이버 계정으로 로그인",
          icon: require("@/assets/images/icon/icon_naver.png"),
          url: "/oauth2/authorization/naver",
        },
        {
          id: "kakao-btn",
          name: "kakao",
          label: "카카오 계정으로 로그인",
          icon: require("@/assets/images/icon/icon_kakao.png"),
          url: "/oauth2/authorization/kakao",
        },
      ],
    };
  },
  methods: {
    loginWithProvider(url) {
      window.location.href = url;
    },
  },
};
</script>

<style scoped>
</style>