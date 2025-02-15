<template>
  <div>
    <v-img
        class="mx-auto my-6"
        max-width="228"
        :src="require('@/assets/images/grinder-logo.png')"
    ></v-img>

    <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="448"
        rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">이메일</div>

      <v-text-field
          density="compact"
          v-model="username"
          placeholder="이메일 주소"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        비밀번호</div>

      <v-text-field
          v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="비밀번호"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          @keydown.enter="handleLogin"
      ></v-text-field>

      <v-card class="mb-12" color="surface-variant" variant="tonal">
        <v-card-text class="text-medium-emphasis text-caption">
          Warning: 최대 3회 실패 시 계정이 잠길 수 있습니다. 계정이 잠기면 관리자에게 문의하세요.
        </v-card-text>
      </v-card>

      <v-btn class="mb-8" color="green darken-1" size="large" variant="tonal" block @click="handleLogin">
        로그인
      </v-btn>

    </v-card>
  </div>
</template>

<script>
import $axios from "@/plugins/axios";
import router from "@/router";
import {useUserStore} from "@/stores/userStore";

export default {
  data() {
    return {
      valid: false,
      username: '',
      password: '',
      visible: false,
    };
  },
  methods: {
    async handleLogin() {
      try {
        // 로그인 요청
        const response = await $axios.post('/admin/login', {
          username: this.username,
          password: this.password,
        });
        console.log(response);

        // 성공 시 Pinia 상태 업데이트
        if (response.status === 200) {

          await router.push('/admin');
        }
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
          alert('이메일 또는 비밀번호가 잘못되었습니다.');
        } else {
          alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      }
    },
  },
  async mounted() {
    const userStore = useUserStore(); // Pinia 상태 가져오기
    // 이미 로그인 상태라면 홈으로 리다이렉트
    await userStore.checkSession();

    if (userStore.isAuthenticated) {
      await router.push("/admin");
    }
  },
};
</script>

<style>
</style>