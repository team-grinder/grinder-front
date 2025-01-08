<template>
  <main class="main-container">
    <article class="main-container-article">
      <img class="main-logo" src="@/assets/images/logo_img.png" alt="grinder-logo" />
      <div class="form-container">
        <div class="form-context">
          <label for="email">이메일</label>
          <div class="form-context-email">
            <input
                type="email"
                id="email"
                v-model="email"
                placeholder="이메일을 입력해주세요"
                class="input-group"
                required
            />
            <button
                type="button"
                class="btn"
                id="email-check-btn"
                @click="checkEmail">
              중복 확인
            </button>
          </div>
          <span v-if="errors.email">{{ errors.email }}</span>
        </div>
        <div class="form-context">
          <label for="nickname">닉네임</label>
          <input
              type="text"
              id="nickname"
              v-model="nickname"
              placeholder="닉네임을 입력해주세요"
              class="input-group"
              required
          />
          <span v-if="errors.nickname">{{ errors.nickname }}</span>
        </div>

        <div class="form-context">
          <label for="pw">비밀번호</label>
          <input
              type="password"
              id="pw"
              v-model="password"
              placeholder="비밀번호를 입력해주세요"
              class="input-group"
              required
          />
          <span v-if="errors.password">{{ errors.password }}</span>
        </div>

        <div class="form-context">
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
        </div>

        <button
            type="button"
            class="btn"
            id="join-btn"
            @click="handleRegister"
        >회원가입</button>
      </div>
    </article>
  </main>
</template>

<script>
import $axios from "@/plugins/axios";
import router from "@/router";

export default {
  name: "RegisterComponent",
  data() {
    return {
      email: "",
      isCheckEmail: false,
      nickname: "",
      password: "",
      confirmPassword: "",
      errors: {},
    };
  },
  methods: {
    async handleRegister() {
      this.errors = {};

      // 간단한 클라이언트 측 유효성 검사
      if (!this.email || !this.validateEmail(this.email)) {
        this.errors.email = "올바른 이메일 형식이 아닙니다.";
        return;
      }

      if (!this.isCheckEmail) {
        this.errors.email = "이메일 중복 확인을 해주세요.";
        return;
      }

      if (!this.nickname) {
        this.errors.nickname = "닉네임을 입력해주세요.";
        return;
      }

      try {
        const response = await $axios.post(
            "/register",
            {
              email: this.email,
              nickname: this.nickname,
              password: this.password,
              confirmPassword: this.confirmPassword
            }
        );

        if (response.data.code === "200") {
          alert("회원가입이 완료되었습니다.");
          await router.push({ name: "Login" });
        }
      } catch (error) {
        // 백엔드에서 전달된 에러 처리
        if (error.response && error.response.data) {
          const errorData = error.response.data;

          if (errorData.data && errorData.data.errorCode) {
            switch(errorData.data.errorCode) {
              case 'AUTH_006': // 이메일 중복
                this.errors.email = errorData.data.errorMessage;
                break;
              case 'AUTH_007': // 비밀번호 규칙 위반
                this.errors.password = errorData.data.errorMessage;
                break;
              case 'AUTH_008': // 비밀번호 불일치
                this.errors.confirmPassword = errorData.data.errorMessage;
                break;
              case 'AUTH_011': // 이메일 형식 오류
                this.errors.email = errorData.data.errorMessage;
                break;
              case 'AUTH_012': // 닉네임 오류
                this.errors.nickname = errorData.data.errorMessage;
                break;
              default:
                alert(errorData.data.errorMessage || "회원가입에 실패했습니다.");
            }
          }
        } else {
          alert("네트워크 오류가 발생했습니다.");
        }
      }
    },
    validateEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },

    async checkEmail() {
      try {
        const response = await $axios.get("/check-email", {
          params: {
            email: this.email,
          },
        });

        console.log(response);
        if (response.data.data) {
          this.errors.email = "이미 사용 중인 이메일입니다.";
        } else {
          alert("사용 가능한 이메일입니다.");
          this.errors.email = "";
          this.isCheckEmail = true;
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.data) {
          this.errors.email = error.response.data.data.errorMessage;
        } else {
          alert("네트워크 오류가 발생했습니다. 서버 상태를 확인하세요.");
        }
        this.isCheckEmail = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/common.css";

body {
  background: linear-gradient(to bottom right, #f5fffa, #ffffff);
}

.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10vh;
  width: 100%;

  .main-container-article {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
    width: 23em;
    padding: 1.5em 1.5em;
    border-radius: 0.8em;
    border: 1px solid #d9d9d9;
    box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1), 2px 0px 4px rgba(0, 0, 0, 0.1),
    0px 2px 4px rgba(0, 0, 0, 0.1);

    .main-logo {
      width: 10em;
    }

    .form-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 1em;

      .form-context {

        label {
          font-weight: bold;
          font-size: 0.9em;
          margin: 1.5em 0 1em;
        }

        .input-group {
          width: 100%;
          height: 3em;
          font-size: 0.8em;
          padding-left: 0.7em;
          border-radius: 0.4em;
          border: 1px solid #d9d9d9;
          box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1), 2px 0 4px rgba(0, 0, 0, 0.1),
          0 2px 4px rgba(0, 0, 0, 0.1);
          box-sizing: border-box;
          margin: 1em 0;
        }

        .form-context-email {
          display: flex;
          justify-content: space-between;
          align-items: center;

          #email-check-btn {
            width: 6em;
            height: 3em;
            font-size: 0.8em;
            background-color: #009b55;
            color: #ffffff;
            border: none;
            border-radius: 0.4em;
            cursor: pointer;
            padding: 0.5em;
            margin: 0 0 0 1em;
          }
        }
      }

      span {
        color: #e10000;
        font-size: 1em;
        font-weight: bold;
        margin-bottom: 1.2em;
      }

      span[th\:if] {
        display: block;
      }

      #join-btn {
        width: 100%;
        height: 2em;
        color: #ffffff;
        font-size: 1em;
        font-weight: 600;
        background-color: #009b55;
        margin-top: 1.5em;
        border-radius: 10px;
        cursor: pointer;
        border: none;
      }
    }
  }
}
</style>