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

body {
  background: linear-gradient(to bottom right, #F5FFFA, white);
}

.main_container-article {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FFFFFF;
  width: 23em;
  padding: 1.5em 1.5em;
  border-radius: 0.8em;
  border: 1px solid #D9D9D9;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1),
  2px 0 4px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main_container-article .main-logo {
  width: 10em;
}

.main_container-article input {
  width: 100%;
  height: 3em;
  font-size: 0.8em;
  padding-left: 2em;
  border-radius: 0.4em;
  border: 1px solid #D9D9D9;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1),
  2px 0 4px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.main_container-article .form-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 1em;
}

.main_container-article .form-container div img {
  position: relative;
  top: 1.8em;
  left: 0.4em;
  width: 1em;
}

.main_container-article .form-container .btn-login {
  width: 100%;
  height: 2em;
  color: #ffffff;
  font-size: 1em;
  font-weight: 600;
  background-color: #009B55;
  margin: 1.5em 0;
  border-radius: 10px;
  cursor: pointer;
  border: none;
}

.main_container-article .a-wrap {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.main_container-article .a-wrap a {
  color: grey;
  font-size: 0.8em;
}

.main_container-article .a-wrap a:hover {
  text-decoration: underline;
}

.main_container-article hr {
  border: 1px solid #D9D9D9;
  width: 100%;
  margin-top: 1.5em;
  margin-bottom: 1em;
}

span {
  font-size: 1em;
  font-weight: bold;
  margin-bottom: 1em;
}

</style>
