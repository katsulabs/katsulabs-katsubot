const WELCOME_GREETINGS = [
  '{0}님, 무엇을 도와드릴까요?',
  '안녕하세요 {0}님, 궁금한 점을 물어보세요.',
  '{0}님, 오늘은 어떤 업무를 도와드릴까요?',
] as const

const INTERNAL_PLACEHOLDERS = [
  '사내 규정·양식·업무에 대해 물어보세요.',
  '효성 그룹 업무 관련 질문을 입력해 주세요.',
  '사내 게시판 정보를 바탕으로 답변해 드립니다.',
] as const

const WEB_PLACEHOLDERS = [
  '웹에서 검색할 내용을 입력해 주세요.',
  '최신 뉴스·일반 정보를 웹에서 찾아 드립니다.',
] as const

const JOURNAL_PLACEHOLDERS = [
  '논문·특허·저널 자료를 검색해 보세요.',
  'R&D 저널에서 관련 연구를 찾아 드립니다.',
] as const

export function pickWelcomeMessage(userName: string): string {
  const template = WELCOME_GREETINGS[Math.floor(Math.random() * WELCOME_GREETINGS.length)]
  return template.replace('{0}', userName)
}

export function pickPlaceholder(searchType: 'internal' | 'web' | 'journal'): string {
  const pool =
    searchType === 'web'
      ? WEB_PLACEHOLDERS
      : searchType === 'journal'
        ? JOURNAL_PLACEHOLDERS
        : INTERNAL_PLACEHOLDERS
  return pool[Math.floor(Math.random() * pool.length)]
}

export const HYOBEE_LABELS = {
  brand: 'Katsubot',
  loginSubtitle: '효성 AI 챗봇에 로그인하세요.',
  userIdLabel: '아이디',
  userIdPlaceholder: '아이디',
  passwordLabel: '비밀번호',
  passwordPlaceholder: '비밀번호',
  passwordLogin: '로그인',
  loginOrDivider: '또는',
  ssoLogin: 'SSO로 로그인',
  devLoginTitle: '로컬 개발',
  devTokenLabel: 'JWT / 개발 토큰',
  devTokenPlaceholder: 'Bearer 토큰 값을 입력하세요',
  devTokenSubmit: '토큰으로 로그인',
  loginFooter: 'SSO 인증 후 이 화면으로 돌아옵니다.',
  logout: '로그아웃',
  newConversation: '새 대화 시작하기',
  deleteConversations: '대화 삭제',
  deleteConversation: '삭제',
  deleteConfirmTitle: '대화를 삭제할까요?',
  deleteConfirmBulkTitle: '선택한 대화를 삭제할까요?',
  deleteConfirmDescription: '삭제하면 복구할 수 없습니다.',
  deleteConfirmAction: '삭제',
  cancel: '취소',
  conversationMenu: '대화 메뉴',
  deleteSelectedCount: '{0}개 삭제',
  selectAll: '전체',
  journal: '저널',
  journalSearch: '저널검색',
  recentConversations: '최근 대화 목록',
  emptyConversations: '최근 대화가 없습니다.',
  moreConversations: '더보기',
  internalSearch: '사내검색',
  webSearch: '웹검색',
  aiDisclaimer: 'AI의 답변은 부정확할 수 있습니다.',
  helpCta: '사용법',
  languageSettings: '언어 설정',
  korean: '한국어',
  themeSettings: '테마',
  themeLight: 'Light',
  themeDark: 'Dark',
  themeGray: 'Gray',
  searchMode: '검색 모드',
} as const
