import { useId } from 'react'
import { searchModeLabel, searchTypeFromChatCategory, type SearchType } from '../lib/chat-category'

export type SearchCategoryBadgeVariant = SearchType

type SearchCategoryBadgeProps = {
  variant?: SearchCategoryBadgeVariant
  chatCategory?: string
  className?: string
}

function resolveVariant(
  variant: SearchCategoryBadgeVariant | undefined,
  chatCategory: string | undefined,
): SearchCategoryBadgeVariant {
  return variant ?? searchTypeFromChatCategory(chatCategory)
}

function InternalBadgeArt({ id }: { id: string }) {
  return (
  <svg
    width="32"
    height="18"
    viewBox="0 0 32 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="block"
  >
    <rect width="32" height="18" rx="6" fill={`url(#${id}-bg)`} />
    <rect x="0.5" y="0.5" width="31" height="17" rx="5.5" stroke="#6491DC" strokeOpacity="0.2" />
    <g filter={`url(#${id}-f0)`}>
      <path
        d="M26.0811 8.93392C26.5123 8.93392 26.8226 8.83102 27.0121 8.62522C27.2016 8.41942 27.2963 8.13195 27.2963 7.76282C27.2963 7.59949 27.2718 7.45085 27.2228 7.31692C27.1738 7.18299 27.0987 7.06865 26.9974 6.97392C26.8994 6.87592 26.7736 6.80079 26.6201 6.74852C26.4698 6.69625 26.2902 6.67012 26.0811 6.67012H25.2187V8.93392H26.0811ZM26.0811 5.43042C26.5842 5.43042 27.0154 5.49085 27.3747 5.61172C27.7373 5.72932 28.0346 5.89265 28.2665 6.10172C28.5017 6.31079 28.6748 6.55742 28.7859 6.84162C28.897 7.12582 28.9525 7.43289 28.9525 7.76282C28.9525 8.11889 28.8953 8.44555 28.781 8.74282C28.6667 9.04009 28.4919 9.29489 28.2567 9.50722C28.0215 9.71955 27.7226 9.88615 27.36 10.007C27.0007 10.1246 26.5744 10.1834 26.0811 10.1834H25.2187V12.5697H23.5625V5.43042H26.0811Z"
        fill="#4749D8"
      />
    </g>
    <g filter={`url(#${id}-f1)`}>
      <path
        d="M19.5785 8.78692C19.8039 8.78692 19.995 8.75915 20.1518 8.70362C20.3118 8.64482 20.4425 8.56479 20.5438 8.46352C20.645 8.36225 20.7185 8.24465 20.7643 8.11072C20.81 7.97352 20.8329 7.82652 20.8329 7.66972C20.8329 7.35612 20.73 7.11112 20.5242 6.93472C20.3216 6.75832 20.0064 6.67012 19.5785 6.67012H18.9121V8.78692H19.5785ZM23.0967 12.5697H21.5973C21.3196 12.5697 21.1203 12.4652 20.9995 12.2561L19.8137 10.1834C19.7581 10.0952 19.6961 10.0315 19.6275 9.99232C19.5589 9.94985 19.4609 9.92862 19.3335 9.92862H18.9121V12.5697H17.2559V5.43042H19.5785C20.0946 5.43042 20.534 5.48432 20.8966 5.59212C21.2624 5.69665 21.5597 5.84365 21.7884 6.03312C22.0203 6.22259 22.1885 6.44635 22.2931 6.70442C22.3976 6.96249 22.4499 7.24342 22.4499 7.54722C22.4499 7.77915 22.4188 7.99802 22.3568 8.20382C22.2947 8.40962 22.2032 8.60072 22.0824 8.77712C21.9615 8.95025 21.8112 9.10542 21.6316 9.24262C21.4552 9.37982 21.251 9.49252 21.0191 9.58072C21.1269 9.63625 21.2281 9.70649 21.3229 9.79142C21.4176 9.87309 21.5025 9.97109 21.5777 10.0854L23.0967 12.5697Z"
        fill="#4749D8"
      />
    </g>
    <g filter={`url(#${id}-f2)`}>
      <path
        d="M16.4362 8.99765C16.4362 9.51378 16.3463 9.99398 16.1667 10.4383C15.9903 10.8825 15.7404 11.2696 15.417 11.5996C15.0936 11.9262 14.7032 12.1827 14.2459 12.3689C13.7918 12.5551 13.2871 12.6482 12.7318 12.6482C12.1764 12.6482 11.6701 12.5551 11.2128 12.3689C10.7554 12.1827 10.3634 11.9262 10.0368 11.5996C9.71338 11.2696 9.46184 10.8825 9.28218 10.4383C9.10578 9.99398 9.01758 9.51378 9.01758 8.99765C9.01758 8.48152 9.10578 8.00132 9.28218 7.55705C9.46184 7.11278 9.71338 6.72732 10.0368 6.40065C10.3634 6.07398 10.7554 5.81755 11.2128 5.63135C11.6701 5.44515 12.1764 5.35205 12.7318 5.35205C13.2871 5.35205 13.7918 5.44678 14.2459 5.63625C14.7032 5.82245 15.0936 6.07888 15.417 6.40555C15.7404 6.73222 15.9903 7.11768 16.1667 7.56195C16.3463 8.00622 16.4362 8.48478 16.4362 8.99765ZM14.7408 8.99765C14.7408 8.64485 14.695 8.32798 14.6036 8.04705C14.5121 7.76285 14.3798 7.52275 14.2067 7.32675C14.0368 7.13075 13.8277 6.98048 13.5795 6.87595C13.3312 6.77142 13.0486 6.71915 12.7318 6.71915C12.4116 6.71915 12.1258 6.77142 11.8743 6.87595C11.626 6.98048 11.4153 7.13075 11.2422 7.32675C11.0723 7.52275 10.9416 7.76285 10.8502 8.04705C10.7587 8.32798 10.713 8.64485 10.713 8.99765C10.713 9.35372 10.7587 9.67385 10.8502 9.95805C10.9416 10.239 11.0723 10.4775 11.2422 10.6735C11.4153 10.8695 11.626 11.0197 11.8743 11.1243C12.1258 11.2255 12.4116 11.2762 12.7318 11.2762C13.0486 11.2762 13.3312 11.2255 13.5795 11.1243C13.8277 11.0197 14.0368 10.8695 14.2067 10.6735C14.3798 10.4775 14.5121 10.239 14.6036 9.95805C14.695 9.67385 14.7408 9.35372 14.7408 8.99765Z"
        fill="#4749D8"
      />
    </g>
    <g filter={`url(#${id}-f3)`}>
      <path
        d="M8.01925 10.7225C8.05845 10.7225 8.09765 10.7306 8.13685 10.747C8.17605 10.76 8.21361 10.7845 8.24955 10.8205L8.90615 11.5114C8.61868 11.887 8.25771 12.1712 7.82325 12.364C7.39205 12.5534 6.88081 12.6482 6.28955 12.6482C5.74728 12.6482 5.26055 12.5567 4.82935 12.3738C4.40141 12.1876 4.03718 11.9328 3.73665 11.6094C3.43938 11.2827 3.21071 10.8972 3.05065 10.453C2.89058 10.0054 2.81055 9.52032 2.81055 8.99765C2.81055 8.46518 2.89711 7.97682 3.07025 7.53255C3.24338 7.08502 3.48675 6.69955 3.80035 6.37615C4.11395 6.05275 4.48961 5.80122 4.92735 5.62155C5.36508 5.44188 5.84691 5.35205 6.37285 5.35205C6.64071 5.35205 6.89225 5.37655 7.12745 5.42555C7.36591 5.47128 7.58805 5.53662 7.79385 5.62155C7.99965 5.70322 8.18911 5.80285 8.36225 5.92045C8.53538 6.03805 8.68891 6.16545 8.82285 6.30265L8.26425 7.05235C8.22831 7.09808 8.18585 7.14055 8.13685 7.17975C8.08785 7.21568 8.01925 7.23365 7.93105 7.23365C7.87225 7.23365 7.81671 7.22058 7.76445 7.19445C7.71218 7.16832 7.65665 7.13728 7.59785 7.10135C7.53905 7.06215 7.47371 7.02132 7.40185 6.97885C7.33325 6.93312 7.24995 6.89228 7.15195 6.85635C7.05721 6.81715 6.94451 6.78448 6.81385 6.75835C6.68645 6.73222 6.53618 6.71915 6.36305 6.71915C6.08865 6.71915 5.83711 6.76978 5.60845 6.87105C5.38305 6.97232 5.18705 7.12095 5.02045 7.31695C4.85711 7.50968 4.72971 7.74815 4.63825 8.03235C4.55005 8.31328 4.50595 8.63505 4.50595 8.99765C4.50595 9.36352 4.55495 9.68855 4.65295 9.97275C4.75421 10.257 4.88978 10.4971 5.05965 10.6931C5.23278 10.8858 5.43368 11.0328 5.66235 11.1341C5.89101 11.2353 6.13601 11.286 6.39735 11.286C6.54761 11.286 6.68481 11.2794 6.80895 11.2664C6.93308 11.25 7.04905 11.2255 7.15685 11.1929C7.26465 11.1569 7.36591 11.1112 7.46065 11.0557C7.55538 10.9969 7.65175 10.9234 7.74975 10.8352C7.78895 10.8025 7.83141 10.7764 7.87715 10.7568C7.92288 10.7339 7.97025 10.7225 8.01925 10.7225Z"
        fill="#4749D8"
      />
    </g>
    <defs>
      <filter id={`${id}-f0`} x="22.5625" y="5.43042" width="7.39062" height="9.1394" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="0.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <filter id={`${id}-f1`} x="16.2559" y="5.43042" width="7.83984" height="9.1394" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="0.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <filter id={`${id}-f2`} x="8.01758" y="5.35205" width="9.41797" height="9.29614" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="0.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <filter id={`${id}-f3`} x="1.81055" y="5.35205" width="8.0957" height="9.29614" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="0.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <linearGradient id={`${id}-bg`} x1="16" y1="0" x2="16" y2="18" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DFEBFF" />
        <stop offset="1" stopColor="#B3CFFF" />
      </linearGradient>
    </defs>
  </svg>
  )
}

function WebBadgeArt({ id }: { id: string }) {
  return (
    <svg
      width="32"
      height="18"
      viewBox="0 0 32 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="block"
    >
      <rect width="32" height="18" rx="6" fill={`url(#${id}-bg)`} />
      <rect x="0.5" y="0.5" width="31" height="17" rx="5.5" stroke="#E67700" strokeOpacity="0.2" />
      <g filter={`url(#${id}-f0)`}>
        <path
          d="M24.2111 11.3202C24.4299 11.3202 24.608 11.2925 24.7452 11.2369C24.8856 11.1814 24.9951 11.1095 25.0735 11.0213C25.1519 10.9331 25.2058 10.8335 25.2352 10.7224C25.2646 10.6114 25.2793 10.4987 25.2793 10.3843C25.2793 10.2537 25.2613 10.1361 25.2254 10.0315C25.1927 9.92699 25.1339 9.83879 25.049 9.76692C24.9673 9.69505 24.8579 9.63952 24.7207 9.60032C24.5835 9.56112 24.4103 9.54152 24.2013 9.54152H23.0449V11.3202H24.2111ZM23.0449 6.67012V8.43412H23.9073C24.0902 8.43412 24.2552 8.42105 24.4022 8.39492C24.5492 8.36879 24.6733 8.32305 24.7746 8.25772C24.8791 8.19239 24.9575 8.10255 25.0098 7.98822C25.0653 7.87389 25.0931 7.73015 25.0931 7.55702C25.0931 7.38715 25.0718 7.24669 25.0294 7.13562C24.9869 7.02129 24.9216 6.92982 24.8334 6.86122C24.7452 6.79262 24.6325 6.74362 24.4953 6.71422C24.3613 6.68482 24.2013 6.67012 24.0151 6.67012H23.0449ZM24.0151 5.43042C24.5083 5.43042 24.9281 5.47615 25.2744 5.56762C25.6206 5.65909 25.9032 5.78812 26.1221 5.95472C26.3409 6.12132 26.4994 6.32385 26.5974 6.56232C26.6986 6.80079 26.7493 7.06702 26.7493 7.36102C26.7493 7.52109 26.7264 7.67625 26.6807 7.82652C26.6349 7.97352 26.5631 8.11235 26.4651 8.24302C26.3671 8.37042 26.2413 8.48802 26.0878 8.59582C25.9342 8.70362 25.7497 8.79672 25.5341 8.87512C26.0045 8.98945 26.3524 9.17402 26.5778 9.42882C26.8032 9.68362 26.9159 10.0136 26.9159 10.4186C26.9159 10.7224 26.8571 11.005 26.7395 11.2663C26.6219 11.5277 26.4487 11.7563 26.2201 11.9523C25.9947 12.1451 25.7154 12.297 25.3822 12.408C25.049 12.5158 24.6684 12.5697 24.2405 12.5697H21.3887V5.43042H24.0151Z"
          fill="#BD6508"
        />
      </g>
      <g filter={`url(#${id}-f1)`}>
        <path
          d="M17.6504 6.70442V8.37042H19.8946V9.59542H17.6504V11.2957H20.5806V12.5697H15.9844V5.43042H20.5806V6.70442H17.6504Z"
          fill="#BD6508"
        />
      </g>
      <g filter={`url(#${id}-f2)`}>
        <path
          d="M15.4017 5.43042L13.1967 12.5697H11.6973L10.3547 8.14502C10.3286 8.07642 10.3041 8.00129 10.2812 7.91962C10.2583 7.83469 10.2355 7.74649 10.2126 7.65502C10.1897 7.74649 10.1669 7.83469 10.144 7.91962C10.1211 8.00129 10.0966 8.07642 10.0705 8.14502L8.70831 12.5697H7.20891L5.00391 5.43042H6.39551C6.53924 5.43042 6.65847 5.46309 6.75321 5.52842C6.85121 5.59375 6.91491 5.68032 6.94431 5.78812L7.92431 9.51212C7.95371 9.62972 7.98311 9.75875 8.01251 9.89922C8.04191 10.0364 8.07131 10.1802 8.10071 10.3304C8.15951 10.0234 8.23137 9.75059 8.31631 9.51212L9.47271 5.78812C9.50211 5.69665 9.56417 5.61499 9.65891 5.54312C9.75691 5.46799 9.87451 5.43042 10.0117 5.43042H10.5017C10.6454 5.43042 10.7614 5.46472 10.8496 5.53332C10.9378 5.59865 11.0048 5.68359 11.0505 5.78812L12.1971 9.51212C12.282 9.74079 12.3539 10.0005 12.4127 10.2912C12.4388 10.1442 12.465 10.007 12.4911 9.87962C12.5205 9.74895 12.5499 9.62645 12.5793 9.51212L13.5593 5.78812C13.5854 5.69339 13.6475 5.61009 13.7455 5.53822C13.8435 5.46635 13.9611 5.43042 14.0983 5.43042H15.4017Z"
          fill="#BD6508"
        />
      </g>
      <defs>
        <filter id={`${id}-f0`} x="20.3887" y="5.43042" width="7.52734" height="9.1394" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="0.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <filter id={`${id}-f1`} x="14.9844" y="5.43042" width="6.5957" height="9.1394" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="0.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <filter id={`${id}-f2`} x="4.00391" y="5.43042" width="12.3984" height="9.1394" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="0.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <linearGradient id={`${id}-bg`} x1="16" y1="0" x2="16" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF4DF" />
          <stop offset="1" stopColor="#FFCC65" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function JournalBadgeArt({ id }: { id: string }) {
  return (
    <svg
      width="32"
      height="18"
      viewBox="0 0 32 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="block"
    >
      <rect width="32" height="18" rx="6" fill={`url(#${id}-bg)`} />
      <rect x="0.5" y="0.5" width="31" height="17" rx="5.5" stroke="#7C6AEC" strokeOpacity="0.2" />
      <g filter={`url(#${id}-f0)`}>
        <text
          x="16"
          y="11.75"
          textAnchor="middle"
          fontSize="6.5"
          fontWeight="700"
          fontFamily="Inter, 'Noto Sans KR', ui-sans-serif, system-ui, sans-serif"
          letterSpacing="0.02em"
          fill="#5B4FCF"
        >
          JRNL
        </text>
      </g>
      <defs>
        <filter id={`${id}-f0`} x="4" y="4" width="24" height="12" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="0.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <linearGradient id={`${id}-bg`} x1="16" y1="0" x2="16" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EDE9FF" />
          <stop offset="1" stopColor="#C4B5FD" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function BadgeArt({ variant }: { variant: SearchCategoryBadgeVariant }) {
  const id = useId().replace(/:/g, '')

  switch (variant) {
    case 'web':
      return <WebBadgeArt id={id} />
    case 'journal':
      return <JournalBadgeArt id={id} />
    default:
      return <InternalBadgeArt id={id} />
  }
}

export function SearchCategoryBadge({ variant, chatCategory, className }: SearchCategoryBadgeProps) {
  const resolved = resolveVariant(variant, chatCategory)

  return (
    <span
      className={['inline-flex shrink-0', className].filter(Boolean).join(' ')}
      aria-label={searchModeLabel(resolved)}
      role="img"
    >
      <BadgeArt variant={resolved} />
    </span>
  )
}
