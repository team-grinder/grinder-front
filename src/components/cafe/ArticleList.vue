<template>
  <v-container
      class="pa-4 mx-auto"
      width="1200">
    <v-row
        v-for="(article, aIndex) in articles"
        :key="article.id"
        class="mb-4"
    >
      <v-col>
        <v-card class="pa-3" elevation="2">
          <v-card-title>

            <div class="d-flex flex-row align-center">
              <v-avatar>
                <v-img
                    :src="!!article.memberImage ? article.memberImage : defaultImage"
                    alt="회원 이미지"
                    cover
                />
              </v-avatar>
              <strong class="pl-5 pr-5">{{ article.nickname }}</strong>
              <span class="text-subtitle-1 text-gray-500">
                {{ article.period }}
              </span>
              <v-spacer></v-spacer>
              <v-menu v-if="article.isMine">
                <template v-slot:activator="{ props }">
                  <v-btn
                      v-bind="props"
                      icon="mdi-dots-vertical"
                      variant="text"
                      @click="likeArticle(aIndex)">
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                      v-for="(item, index) in mineList"
                      :key="index"
                      :value="index"
                  >
                    <v-list-item-title
                        class="pa-2"
                        @click="item."
                    >{{ item.title }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>

            <div class="d-flex align-center text-gray-500 mt-2">
              <span class="text-subtitle-1">평점 : </span>
              <v-rating
                  class="ratings"
                  :length="5"
                  size="28"
                  :model-value="article.rating"
                  disabled
                  readonly
                  active-color="yellow-darken-2"
              />
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <div class="mb-2">
              {{ article.content }}
            </div>

            <!-- 첨부 이미지 영역 -->
            <div class="d-flex flex-column mt-3">
              <v-row class="flex-row">
                <v-col
                    class="d-flex justify-start"
                    v-for="(image, index) in article.attachments"
                    :key="index"
                >
                  <v-img
                      :src="image.imageUrl"
                      :rounded="true"
                      max-height="150"
                  />
                </v-col>
              </v-row>
            </div>

            <!-- 좋아요와 댓글 버튼 -->
            <div class="d-flex justify-end align-center mt-2">
              <div>
                <v-btn
                    class=""
                    color="green-darken-1"
                    icon="mdi-thumb-up"
                    variant="text"
                    :active="article.isLike"
                    @click="likeArticle(aIndex)"
                ></v-btn>
                <span>{{ article.likes }}</span>
              </div>
              <div>
                <v-btn
                    class=""
                    color="green-darken-1"
                    icon="mdi-comment-outline"
                    variant="text"
                    @click="toggleComments(aIndex)"
                ></v-btn>
                <span>{{ article.comments.length }}</span>
              </div>
            </div>

            <div v-if="article.showComments" class="mt-4 pa-2">
              <div
                  v-for="(comment, cIndex) in article.comments"
                  :key="cIndex"
                  class="pa-3 mb-2 border-thin rounded-lg"
              >
                <div class="d-flex align-center mb-2">
                  <v-avatar size="32">
                    <v-img
                        :src="!!comment.memberImage ? comment.memberImage : defaultImage"
                        alt="댓글 작성자 프로필"
                        cover
                    />
                  </v-avatar>
                  <span class="ml-2 font-weight-medium">
                    {{ comment.nickname }}
                  </span>
                  <v-spacer></v-spacer>
                </div>

                <div>{{ comment.content }}</div>

                <!-- 좋아요와 댓글 버튼 -->
                <div class="d-flex justify-end align-center mt-2">
                  <div class="pa-2">
                    <v-btn
                        class=""
                        color="green-darken-1"
                        icon="mdi-comment-outline"
                        variant="text"
                        @click="toggleReplies(aIndex, cIndex)"
                    ></v-btn>
                    <span>{{ comment.replies.length }}</span>
                  </div>
                </div>

                <div
                    v-if="comment.showReplies"
                    class="mt-2 ml-4"
                >
                  <div
                      v-for="(reply, rIndex) in comment.replies"
                      :key="rIndex"
                      class="pa-2 mb-1"
                      style="border-left: 3px solid #999;"
                  >
                    <div class="d-flex align-center mb-1">
                      <v-avatar size="24">
                        <v-img
                            :src="!!reply.memberImage ? reply.memberImage : defaultImage"
                            alt="대댓글 작성자 프로필"
                            cover
                        />
                      </v-avatar>
                      <span class="ml-1">
                        {{ reply.nickname }}
                      </span>
                    </div>
                    <div class="ml-3">{{ reply.content }}</div>
                  </div>

                  <!-- ▼ 댓글 "더보기" 버튼 ▼ -->
                  <div class="d-flex justify-center" v-if="article.hasMoreComments">
                    <v-btn
                        color="green-darken-1"
                        @click="loadMoreComments(aIndex)"
                    >
                      더보기
                    </v-btn>
                  </div>

                  <div
                      class="d-flex align-center mt-2"
                      v-if="isAuthenticated">
                    <v-text-field
                        v-model="comment.newReply.content"
                        label="대댓글 작성"
                        variant="outlined"
                        hide-details="auto"
                        class="mr-2"
                    />
                    <v-btn
                        color="green-darken-1"
                        @click="addReply(aIndex, cIndex)"
                    >
                      등록
                    </v-btn>
                  </div>
                </div>
              </div>

              <div
                  class="d-flex align-center mt-4"
                  v-if="isAuthenticated">
                <v-text-field
                    v-model="article.newComment.content"
                    label="댓글 작성"
                    variant="outlined"
                    hide-details="auto"
                    class="mr-2"
                />
                <v-btn
                    color="green-darken-1"
                    @click="addComment(aIndex)"
                >
                  등록
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import defaultImage from "@/assets/images/basic-user-img.png";
import $axios from "@/plugins/axios";

export default {
  name: 'ArticleList',
  props: {
    isAuthenticated: {
      type: Boolean,
      required: true,
    },
    nickname: {
      type: String,
      required: false,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    articles: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      defaultImage: defaultImage,
      lastScrollLoad: 0,      // 마지막 요청 시각 (ms)
      throttleInterval: 1000, // 1초 간격 (원하는 값으로 조정 가능)
      lastClick: 0,           // 마지막 클릭 시각 (ms)
      mineList: [
        {
          title : "수정",
        },
        {
          title : "삭제",
        },
      ],
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeMount() { // Vue3 사용 시 beforeUnmount() 사용
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    // 스크롤 이벤트 핸들러 (throttle 적용)
    handleScroll() {
      const now = Date.now();
      // 마지막 요청 이후 throttleInterval(1초) 이내면 리턴
      if (now - this.lastScrollLoad < this.throttleInterval) return;

      // 페이지 하단에 300px 이내로 도달하면
      if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 300)) {
        this.lastScrollLoad = now;
        // 부모 컴포넌트에 더 많은 게시글 요청 이벤트를 emit
        this.$emit('load-more');
      }
    },
    // 새 댓글 등록
    addComment(articleIndex) {
      const article = this.articles[articleIndex];
      const { content } = article.newComment;
      if (content.trim()) {
        // 새 댓글 객체 생성
        const newC = {
          nickname: this.nickname,
          memberImage: this.imageUrl,
          content: content.trim(),
          showReplies: false,
          newReply: { content: "" },
          replies: [],
        };
        article.comments.push(newC);
        // 입력 폼 초기화
        article.newComment = { content: "" };
      }
    },

    // 대댓글 토글
    toggleReplies(articleIndex, commentIndex) {
      const comment = this.articles[articleIndex].comments[commentIndex];
      comment.showReplies = !comment.showReplies;
    },

    // 대댓글 등록
    addReply(articleIndex, commentIndex) {
      const comment = this.articles[articleIndex].comments[commentIndex];
      const { content } = comment.newReply;
      if (content.trim()) {
        // 새 대댓글 객체 생성
        const newR = {
          nickname: this.nickname,
          memberImage: this.imageUrl,
          content: content.trim(),
          showReplies: false,
          newReply: { content: "" },
          replies: [],
        };
        comment.replies.push(newR);
        // 입력 폼 초기화
        comment.newReply = { content: "" };
      }
    },

    likeArticle(articleIndex) {
      if (!this.isAuthenticated) {
        alert('로그인이 필요한 서비스입니다.');
        return;
      }

      // 인터벌을 통한 중복 클릭 방지
      if (Date.now() - this.lastClick < 1000) return;

      const article = this.articles[articleIndex];

      if (article.isLike) {
        // 좋아요 취소 API 호출
        try {
          $axios.delete(`like/feed/${article.id}`)
              .then(() => {
                // 좋아요 수 감소
                article.likes--;
                article.isLike = false;
              });
        } catch (err) {
          console.error('좋아요 취소 실패', err);
        }
      } else {
        // 좋아요 API 호출
        try {
          $axios.post(`like/feed/${article.id}`)
              .then(() => {
                // 좋아요 수 증가
                article.likes++;
                article.isLike = true;
              });
        } catch (err) {
          console.error('좋아요 실패', err);
        }
      }

      this.lastClick = Date.now();

    },

    toggleComments(articleIndex) {
      const article = this.articles[articleIndex];
      // 댓글 창 열림/닫힘
      article.showComments = !article.showComments;

      // 열리는 시점 && 아직 한 번도 로딩된 적이 없는 경우만 fetch
      if (article.showComments && article.comments.length === 0) {
        this.fetchComments(articleIndex);
      }
    },

    async fetchComments(articleIndex) {
      const feed = this.articles[articleIndex];
      try {
        // 서버로부터 댓글 목록 불러오기 (예: page=article.commentPage, size=10)
        const response = await $axios.get(`comment/${feed.id}`, {
          params: {
            page: feed.commentPage,
            size: 10
          }
        });


        // 서버 응답 예시: { code: "200", data: { content: [...], hasNext: true }}
        const serverComments = response.data.data.content || [];
        // 기존에 로드된 댓글 뒤에 추가
        feed.comments.push(...serverComments.map(c => ({
          nickname: c.nickname,
          memberImage: c.memberImageUrl || '',
          content: c.content,
          showReplies: false,
          replies: [],
          // 대댓글 페이징 처리 시 필요
          replyPage: 1,
          hasMoreReplies: true,
          newReply: { content: '' },
        })));

        // “hasNext” 여부에 따라 hasMoreComments를 업데이트
        feed.hasMoreComments = response.data.data.hasNext;

        // 댓글을 성공적으로 가져왔다면, 페이지 번호 증가
        feed.commentPage += 1;
      } catch (err) {
        console.error('댓글 불러오기 실패', err);
      }
    },

    // "더보기" 버튼 클릭 시 다음 페이지 호출
    async loadMoreComments(articleIndex) {
      await this.fetchComments(articleIndex);
    },
  },
};
</script>

<style scoped>
</style>