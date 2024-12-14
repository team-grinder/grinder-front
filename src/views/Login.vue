<template>
  <div class="login-page">
    <article class="main_container-article">
      <img src="@/assets/images/logo_img.png" alt="grinder_logo" class="main-logo" />
      <form @submit.prevent="handleLogin" class="form-container">
        <div class="email-box">
          <img src="@/assets/images/icon/BsPersonCircle.png" alt="member_img" />
          <input
              id="emailInput"
              v-model="email"
              name="email"
              type="email"
              placeholder="이메일"
              required
          />
        </div>
        <div class="pw-box">
          <img src="@/assets/images/icon/BsFillLockFill.png" alt="" />
          <input
              id="pwInput"
              v-model="password"
              name="password"
              type="password"
              placeholder="비밀번호"
              required
          />
        </div>
        <button type="submit" class="btn-login">로그인</button>
      </form>
      <div class="a-wrap">
        <a href="/register">회원가입</a>
        <a href="/page/change/password">비밀번호를 잊어버리셨나요?</a>
      </div>
      <hr />
      <span>다른 계정으로 로그인</span>
      <SocialLoginButtons class="social-main-box"/>
    </article>
  </div>
</template>

<script>
import '@/assets/css/login.css'
import SocialLoginButtons from "@/components/login/SocialLoginButtons.vue";

export default {
  name: "LoginComponent",
  components: {
    SocialLoginButtons,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    handleLogin() {
      alert(`이메일: ${this.email}, 비밀번호: ${this.password}`);
    },
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.social-main-box {
  width: 100%;
}
</style>
