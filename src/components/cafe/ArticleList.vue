<template>
  <v-container class="pa-4">
    <v-row
        v-for="(article, aIndex) in articles"
        :key="article.id"
        class="mb-4"
    >
      <v-col>
        <v-card elevation="2">
          <v-card-title>
            <v-avatar
                :src="article.memberImage"
                alt="회원 이미지"
                cover>
            </v-avatar>

            <div class="ml-3">
              <strong>{{ article.memberName }}</strong>
              <span class="text-caption text-gray-500">
                {{ article.period }}
              </span>
            </div>

            <v-divider></v-divider>

            <div>평점:
              <template v-for="n in 5" :key="n">
                <v-icon
                    v-if="n <= article.rating"
                    color="yellow"
                    size="24"
                    density="compact"
                >
                  mdi-star
                </v-icon>
                <v-icon
                    v-else
                    color="yellow"
                    size="24"
                    density="compact"
                >
                  mdi-star-outline
                </v-icon>
              </template>
            </div>
          </v-card-title>

          <v-card-text>
            <div class="mb-2">
              {{ article.content }}
            </div>

            <v-btn
                color="green-darken-1"
                variant="outlined"
                class="mr-2"
                @click="likeArticle(aIndex)"
            >
              좋아요 ({{ article.likes }})
            </v-btn>
            <v-btn
                color="green-darken-1"
                variant="outlined"
                @click="toggleComments(aIndex)"
            >
              댓글 ({{ article.comments.length }})
            </v-btn>

            <div v-if="article.showComments" class="mt-4">
              <div
                  v-for="(comment, cIndex) in article.comments"
                  :key="cIndex"
                  class="pa-3 mb-2"
                  style="border: 1px solid #ccc; border-radius: 4px;"
              >
                <div class="d-flex align-center mb-2">
                  <v-avatar size="32">
                    <v-img
                        :src="comment.memberImage"
                        alt="댓글 작성자 프로필"
                        cover
                    />
                  </v-avatar>
                  <span class="ml-2 font-weight-medium">
                    {{ comment.memberName }}
                  </span>
                  <v-spacer></v-spacer>
                </div>

                <div>{{ comment.content }}</div>

                <v-btn
                    color="green-darken-1"
                    variant="text"
                    class="mt-2"
                    @click="toggleReplies(aIndex, cIndex)"
                >
                  대댓글 ({{ comment.replies.length }})
                </v-btn>

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
                            :src="reply.memberImage"
                            alt="대댓글 작성자 프로필"
                            cover
                        />
                      </v-avatar>
                      <span class="ml-1">
                        {{ reply.memberName }}
                      </span>
                    </div>
                    <div class="ml-3">{{ reply.content }}</div>
                  </div>

                  <div class="d-flex align-center mt-2">
                    <v-text-field
                        v-model="comment.newReply.memberName"
                        label="이름"
                        variant="outlined"
                        density="compact"
                        class="mr-2"
                        style="max-width: 120px;"
                    />
                    <v-text-field
                        v-model="comment.newReply.memberImage"
                        label="이미지"
                        variant="outlined"
                        density="compact"
                        class="mr-2"
                        style="max-width: 120px;"
                    />
                    <v-text-field
                        v-model="comment.newReply.content"
                        label="대댓글 작성"
                        variant="outlined"
                        density="compact"
                        class="mr-2 flex-grow-1"
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

              <div class="d-flex align-center mt-4">
                <v-text-field
                    v-model="article.newComment.memberName"
                    label="이름"
                    variant="outlined"
                    density="compact"
                    class="mr-2"
                    style="max-width: 120px;"
                />
                <v-text-field
                    v-model="article.newComment.memberImage"
                    label="이미지"
                    variant="outlined"
                    density="compact"
                    class="mr-2"
                    style="max-width: 120px;"
                />
                <v-text-field
                    v-model="article.newComment.content"
                    label="댓글 작성"
                    variant="outlined"
                    density="compact"
                    class="mr-2 flex-grow-1"
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
export default {
  name: 'ArticleList',
  data() {
    return {
      articles: [
        {
          id: 1,
          memberName: "홍길동",
          memberImage: "",
          content: "카페가 너무 좋아요!",
          rating: 4.5,
          period: "2025-01-01",
          likes: 2,
          showComments: false, // 댓글 영역 토글
          newComment: {
            memberName: "",    // 새 댓글 작성 시 입력
            memberImage: "",
            content: "",
          },
          comments: [
            {
              memberName: "김영희",
              memberImage: "/path/to/member2.jpg",
              content: "저도 동감합니다!",
              showReplies: false,
              newReply: {
                memberName: "",
                memberImage: "",
                content: "",
              },
              replies: [
                {
                  memberName: "이철수",
                  memberImage: "/path/to/member3.jpg",
                  content: "저도 좋아요!",
                  // 대댓글은 또 다른 replies... (원하면 재귀적으로 가능)
                  showReplies: false,
                  newReply: { memberName: "", memberImage: "", content: "" },
                  replies: []
                }
              ]
            },
          ]
        },
      ]
    };
  },
  methods: {
    // 좋아요 증가
    likeArticle(articleIndex) {
      this.articles[articleIndex].likes++;
    },

    // 댓글 토글
    toggleComments(articleIndex) {
      this.articles[articleIndex].showComments =
          !this.articles[articleIndex].showComments;
    },

    // 새 댓글 등록
    addComment(articleIndex) {
      const article = this.articles[articleIndex];
      const { memberName, memberImage, content } = article.newComment;
      if (memberName.trim() && content.trim()) {
        // 새 댓글 객체 생성
        const newC = {
          memberName: memberName.trim(),
          memberImage: memberImage.trim(),
          content: content.trim(),
          showReplies: false,
          newReply: { memberName: "", memberImage: "", content: "" },
          replies: [],
        };
        article.comments.push(newC);
        // 입력 폼 초기화
        article.newComment = { memberName: "", memberImage: "", content: "" };
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
      const { memberName, memberImage, content } = comment.newReply;
      if (memberName.trim() && content.trim()) {
        // 새 대댓글 객체 생성
        const newR = {
          memberName: memberName.trim(),
          memberImage: memberImage.trim(),
          content: content.trim(),
          showReplies: false,
          newReply: { memberName: "", memberImage: "", content: "" },
          replies: [],
        };
        comment.replies.push(newR);
        // 입력 폼 초기화
        comment.newReply = { memberName: "", memberImage: "", content: "" };
      }
    },
  },
};
</script>