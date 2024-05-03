// const paths = {
//   home() {
//     return '/'
//   },
//   topicShow(topicSlug: string) {
//     return `topics/${topicSlug}`
//   },
//   postCreate(topicSlug: string){
//     return 'topics/${topicSlug}/posts/new'
//   },
//   postShow(topicSlug: string, postId: string){
//     return `topics/${topicSlug}/posts/${postId}`
//   }
// }

// export default paths;

const paths = {
  home() {
    return '/';
  },
  topicShow(topicSlug: string) {
    return `/topics/${topicSlug}`;
  },
  postCreate(topicSlug: string) {
    return `/topics/${topicSlug}/posts/new`;
  },
  postShow(topicSlug: string, postId: string) {
    return `/topics/${topicSlug}/posts/${postId}`;
  },
};

export default paths;

// const paths = {
//   home() {
//     return '/';
//   },
//   topicShow(topicSlug: string) {
//     return `topics/${topicSlug}`; // Remove 'topics/' prefix
//   },
//   postCreate(topicSlug: string) {
//     return `${topicSlug}/posts/new`; // Remove 'topics/' prefix
//   },
//   postShow(topicSlug: string, postId: string) {
//     return `${topicSlug}/posts/${postId}`; // Remove 'topics/' prefix
//   }
// };

// export default paths;