<template>
  <div>
    <CafeInfoBanner :cafeInfo="cafeInfo" />
    <CafeInfoTab :cafeInfo="cafeInfo" />
  </div>
</template>

<script>
import CafeInfoBanner from '@/components/cafe/CafeInfoBanner.vue';
import CafeInfoTab from '@/components/cafe/CafeInfoTab.vue';
import axios from 'axios';

export default {
  name: 'CafeInformation',
  components: {
    CafeInfoBanner,
    CafeInfoTab,
  },
  data() {
    return {
      cafeInfo: null, // 카페 정보를 저장
      loading: true,
      error: null,
    };
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  async created() {
    try {
      this.cafeInfo = {
        "id": 1,
        "name": "Bluebird Coffee",
        "address": "123 Coffee Street",
        "phoneNum": "010-1234-5678",
        "averageGrade": 4.5,
        "logoUrl": "",
        "imageUrl": ""
      };
      const response = await axios.get(`cafe/${this.id}`);

      response.data;
    } catch (err) {
      this.error = '카페 정보를 불러올 수 없습니다.';
    } finally {
      this.loading = false;
    }
  },
};
</script>