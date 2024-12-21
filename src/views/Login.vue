<template>
  <div class="login-page">
    <article class="main_container-article">
      <img src="@/assets/images/logo_img.png" alt="grinder_logo" class="main-logo" />
      <div class="form-container">
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
        <button type="button" class="btn-login"
                @click="handleLogin">로그인</button>
      </div>
      <div class="a-wrap">
        <a href="/register">회원가입</a>
        <a @click="changePassword">비밀번호를 잊어버리셨나요?</a>
      </div>
      <hr />
      <span>다른 계정으로 로그인</span>
      <SocialLoginButtons class="social-main-box"/>
    </article>
  </div>
</template>

<script>
import $axios from "@/plugins/axios";
import SocialLoginButtons from "@/components/login/SocialLoginButtons.vue";
import router from "@/router";
import { useUserStore } from "@/stores/userStore";

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
    async handleLogin() {
      try {
        // 로그인 요청
        const response = await $axios.post('/login', {
          email: this.email,
          password: this.password,
        });
        console.log(response);

        // 성공 시 Pinia 상태 업데이트
        if (response.status === 200) {
          alert('로그인 성공!');

          router.push('/');
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
    changePassword() {
      alert('비밀번호 찾기 기능은 준비 중입니다.');
    },
  },
  async mounted() {
    const userStore = useUserStore(); // Pinia 상태 가져오기
    // 이미 로그인 상태라면 홈으로 리다이렉트
    await userStore.checkSession();

    if (userStore.isAuthenticated) {
      this.$router.push("/");
    }
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
