<template>
  <v-container
      class="pa-4 mx-auto"
      width="1200">
    <v-row
        v-for="(article, aIndex) in feedList"
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
                      variant="text">
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                      v-for="(item, index) in mineList"
                      :key="index"
                      :value="index"
                      @click="handleMenuAction(item, article, aIndex)"
                  >
                    <v-list-item-title
                        class="pa-2"
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
                    :icon="article.isLike ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'"
                    variant="text"
                    @click="likeArticle(aIndex)"
                ></v-btn>
                <span>{{ article.likes }}</span>
              </div>
              <div>
                <v-btn
                    class=""
                    color="green-darken-1"
                    :icon="article.showComments ? 'mdi-comment' : 'mdi-comment-outline'"
                    variant="text"
                    @click="toggleComments(aIndex)"
                ></v-btn>
                <span>{{ article.commentCount }}</span>
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
                        :icon="comment.showReplies ? 'mdi-comment' : 'mdi-comment-outline'"
                        variant="text"
                        @click="toggleReplies(aIndex, cIndex)"
                    ></v-btn>
                    <span>{{ comment.replyCount }}</span>
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
import $axios from "@/plugins/axios";
import { useFeedStore } from "@/stores/feedStore";
import defaultImage from "@/assets/images/basic-user-img.png";

export default {
  name: 'ArticleList',
  components: {
  },
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
  },
  computed: {
    feedStore() {
      return useFeedStore();
    },
    feedList() {
      return this.feedStore.feedList;
    },
  },
  data() {
    return {
      defaultImage: defaultImage,
      lastScrollLoad: 0,      // 마지막 요청 시각 (ms)
      throttleInterval: 1000, // 1초 간격 (원하는 값으로 조정 가능)
      lastClick: 0,           // 마지막 클릭 시각 (ms)
      mineList: [
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
    handleMenuAction(item, article, aIndex) {
      if (item.title === '삭제') {
        if (confirm("게시글을 삭제하시겠습니까?")) {
          this.deleteArticle(article, aIndex);
        }
      }
    },

    deleteArticle(article, aIndex) {
      try {
        $axios.delete(`feed/${article.id}`)
            .then(() => {
              this.feedList.splice(aIndex, 1);
            });
      } catch (err) {
        console.error('게시글 삭제 실패', err);
      }
    },

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
    addComment(feedIndex) {
      const article = this.feedList[feedIndex];
      const { content } = article.newComment;
      if (content.trim()) {
        try {
          $axios.post(`comment/create`,
              {
                feedId: article.id,
                content: content
              })
              .then((data) => {
                article.newComment.content = '';
                // 새로 불러오기
                article.comments.push(this.fetchComment(data.data));
              });
        } catch (err) {
          console.error('댓글 등록 실패', err);
        }
      }
    },

    // 대댓글 토글
    toggleReplies(articleIndex, commentIndex) {
      const feed = this.feedList[articleIndex];
      const comment = this.feedList[articleIndex].comments[commentIndex];

      comment.showReplies = !comment.showReplies;

      console.log(comment);

      if (comment.showReplies && comment.replies.length === 0) {
        this.fetchReplies(feed?.id, comment);
      }
    },

    // 대댓글 불러오기
    async fetchReplies(feedId, comment) {
      try {
        const response = await $axios.get(`comment`, {
          params: {
            feedId: feedId,
            commentId: comment.id,
            page: comment.replyPage,
            size: 10
          }
        });

        const serverReplies = response.data.data.content || [];
        comment.replies.push(...serverReplies.map(r => ({
          id: r.id,
          nickname: r.nickname,
          memberImage: r.memberImageUrl || '',
          content: r.content,
          showReplies: false,
          newReply: { content: '' },
        })));

        comment.hasMoreReplies = response.data.data.hasNext;
        comment.replyPage += 1;
      } catch (err) {
        console.error('대댓글 불러오기 실패', err);
      }
    },

    // 대댓글 등록
    addReply(articleIndex, commentIndex) {
      const feed = this.feedList[articleIndex];
      const comment = this.feedList[articleIndex].comments[commentIndex];
      const { content } = comment.newReply;
      if (content.trim()) {
        try {
          $axios.post(`comment/create`,
              {
                feedId: feed.id,
                content: content,
                parentCommentId: comment.id
              })
              .then((data) => {
                comment.newReply.content = '';
                // 새로 불러오기
                comment.replies.push(this.fetchComment(data.data));
              });
        } catch (err) {
          console.error('대댓글 등록 실패', err);
        }
      }
    },

    likeArticle(articleIndex) {
      if (!this.isAuthenticated) {
        alert('로그인이 필요한 서비스입니다.');
        return;
      }

      // 인터벌을 통한 중복 클릭 방지
      if (Date.now() - this.lastClick < 1000) return;

      const article = this.feedList[articleIndex];

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
      const article = this.feedList[articleIndex];
      // 댓글 창 열림/닫힘
      article.showComments = !article.showComments;

      // 열리는 시점 && 아직 한 번도 로딩된 적이 없는 경우만 fetch
      if (article.showComments && article.comments.length === 0) {
        this.fetchComments(articleIndex);
      }
    },

    async fetchComments(articleIndex) {
      const feed = this.feedList[articleIndex];
      try {
        const response = await $axios.get(`comment`, {
          params: {
            feedId: feed.id,
            page: feed.commentPage,
            size: 10
          }
        });

        const serverComments = response.data.data.content || [];
        // 기존에 로드된 댓글 뒤에 추가
        feed.comments.push(...serverComments.map(c => ({
          id: c.id,
          nickname: c.nickname,
          memberImage: c.memberImageUrl || '',
          content: c.content,
          showReplies: false,
          replyCount: c.replyCount,
          replies: [],
          // 대댓글 페이징 처리 시 필요
          replyPage: 0,
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

    // 작성한 댓글 단건 조회
    async fetchComment(commentId) {
      try {
        const response = await $axios.get(`comment/${commentId}`);
        const serverComment = response.data.data;
        return {
          nickname: serverComment.nickname,
          memberImage: serverComment.memberImageUrl || '',
          content: serverComment.content,
          showReplies: false,
          replies: [],
          replyPage: 0,
          hasMoreReplies: true,
          newReply: { content: '' },
        };
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