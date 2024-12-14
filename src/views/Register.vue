<template>
  <main class="main-container">
    <article class="main-container-article">
      <img class="main-logo" src="@/assets/images/logo_img.png" alt="grinder-logo" />
      <form @submit.prevent="handleRegister" class="form-container">
        <label for="email">이메일</label>
        <input
            type="email"
            id="email"
            v-model="email"
            placeholder="이메일을 입력해주세요"
            class="input-group"
            required
        />
        <span v-if="errors.email">{{ errors.email }}</span>

        <label for="pw">비밀번호</label>
        <input
            type="password"
            id="pw"
            v-model="password"
            placeholder="비밀번호를 입력해주세요"
            class="input-group"
            required
        />

        <label for="pwCheck">비밀번호 재확인</label>
        <input
            type="password"
            id="pwCheck"
            v-model="confirmPassword"
            placeholder="비밀번호를 다시 입력해주세요"
            class="input-group"
            required
        />
        <span v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>

        <button type="submit" class="btn" id="join-btn">회원가입</button>
      </form>
    </article>
  </main>
</template>

<script>
import "@/assets/css/register.css";

export default {
  name: "RegisterComponent",
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      errors: {},
    };
  },
  methods: {
    handleRegister() {
      this.errors = {};

      // 간단한 클라이언트 측 유효성 검사
      if (!this.email) {
        this.errors.email = "이메일을 입력해주세요.";
      } else if (!this.validateEmail(this.email)) {
        this.errors.email = "올바른 이메일 형식이 아닙니다.";
      }

      if (this.password !== this.confirmPassword) {
        this.errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
      }

      if (Object.keys(this.errors).length === 0) {
        alert(`회원가입 성공! 이메일: ${this.email}`);
        // 서버로 데이터 전송
      }
    },
    validateEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },
  },
};
</script>