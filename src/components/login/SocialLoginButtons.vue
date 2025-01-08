<template>
  <div>
    <div class="social-box" v-for="provider in socialProviders" :key="provider.id">
      <button :id="provider.id" @click="loginWithProvider(provider)">
        <img :src="provider.icon" :alt="`${provider.name}_icon`" />
        {{ provider.label }}
      </button>
    </div>
  </div>
</template>

<script>
import "@/assets/css/socialLogin.css";
import { useRouter } from 'vue-router';
import { useUserStore } from "@/stores/userStore";

export default {
  name: "SocialLoginButtons",
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    return { router, userStore };
  },
  data() {
    const baseUrl = 'http://localhost:8080';
    return {
      socialProviders: [
        {
          id: "google-btn",
          name: "google",
          label: "구글 계정으로 로그인",
          icon: require("@/assets/images/icon/icon_google.png"),
          url: `${baseUrl}/oauth2/authorization/google`
        },
        {
          id: "naver-btn",
          name: "naver",
          label: "네이버 계정으로 로그인",
          icon: require("@/assets/images/icon/icon_naver.png"),
          url: `${baseUrl}/oauth2/authorization/naver`
        },
        {
          id: "kakao-btn",
          name: "kakao",
          label: "카카오 계정으로 로그인",
          icon: require("@/assets/images/icon/icon_kakao.png"),
          url: `${baseUrl}/oauth2/authorization/kakao`
        },
      ],
    };
  },
  methods: {
    loginWithProvider(provider) {
      window.location.href = provider.url;
    }
  },
  async mounted() {
    if (window.location.search.includes('code=')) {
      await this.userStore.checkSession();
      if (this.userStore.isAuthenticated) {
        this.router.push('/');
      }
    }
  }
};
</script>

<style scoped>
</style>