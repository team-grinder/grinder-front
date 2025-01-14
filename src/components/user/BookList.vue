<template>
  <v-card
      class="mx-auto"
      width="1200"
      variant="outlined"
  >
    <template v-slot:title>
      <span class="font-weight-black">카페 이름</span>
    </template>
    <template v-slot:subtitle>
      <span>2025-01-15 05:00 ~ 07:00</span>
    </template>

    <v-card-text class="bg-surface-light pt-4">
      <p>결제 비용(10000원)</p>
      <p>결제 비용(10000원)</p>
      <v-card-actions class="d-flex justify-end">
        <v-btn
            color="green-darken-1"
            variant="tonal"
            @click="goToReview">
          리뷰 작성
        </v-btn>
      </v-card-actions>
    </v-card-text>

  </v-card>
</template>

<script>
export default {
  name: "BookList",
  data() {
    return {

    };
  },
  methods: {
    goToReview() {
      this.$router.push({ name: "ReviewCreate" });
    }
  }
}

</script>

<style scoped>

</style>