
const scopes = [
  'public_profile',
  'email',
  'pages_show_list',
  'pages_messaging',
  'pages_read_engagement',
  'pages_manage_engagement',
  'pages_manage_metadata',
  'pages_read_user_content',
  'business_management',
].join(',')

const _fetchPage = (user, callback) => {
  if (user && user.authResponse) {
    window.FB.api(
      `${user.authResponse.userID}/accounts?limit=100`,
      { access_token: user.authResponse.accessToken },
      (pages) => {
        callback(user, pages.data)
      }
    )
  }
}

export const handleLinkPage = (callback) => {
  window.FB.login(
    (user) => {
      _fetchPage(user, callback)
    },
    { scope: scopes }
  )
}
