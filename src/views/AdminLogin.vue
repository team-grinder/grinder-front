<template>
    <v-container
        class="d-flex justify-center align-center"
    >
      <v-card width="400" elevation="10">
        <v-card-title class="text-center" style="color: #009B55;">
          관리자 로그인
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid">
            <v-text-field
                v-model="username"
                label="아이디"
                outlined
                color="primary"
                :rules="[rules.required]"
            ></v-text-field>

            <v-text-field
                v-model="password"
                label="비밀번호"
                outlined
                type="password"
                color="primary"
                :rules="[rules.required]"
            ></v-text-field>

            <v-btn
                class="me-2"
                block
                color="#009B55"
                @click="login"
                variant="flat"
                :disabled="!valid"
            >
              로그인
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      username: '',
      password: '',
      rules: {
        required: (value) => !!value || '필수 입력 항목입니다.',
      },
    };
  },
  methods: {
    login() {
      if (this.valid) {
        alert(`환영합니다, ${this.username}님!`);
        // 실제 로그인 로직 추가
      } else {
        alert('아이디와 비밀번호를 입력해주세요.');
      }
    },
  },
};
</script>

<style>
/* 추가 스타일 */
.v-card-title {
  font-size: 24px;
  font-weight: bold;
}
</style>