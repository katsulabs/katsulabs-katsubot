export type SearchType = 'internal' | 'web' | 'journal'

export function toApiChatCategory(searchType: SearchType): string {
  switch (searchType) {
    case 'web':
      return 'web_search'
    case 'journal':
      return 'rnd_search'
    default:
      return 'internal_rules'
  }
}

export function searchTypeFromChatCategory(category: string | undefined): SearchType {
  switch (category) {
    case 'web_search':
      return 'web'
    case 'rnd_search':
      return 'journal'
    default:
      return 'internal'
  }
}

export function searchModeLabel(searchType: SearchType): string {
  switch (searchType) {
    case 'web':
      return '웹검색'
    case 'journal':
      return '저널검색'
    default:
      return '사내검색'
  }
}
