// 시작 화면
import {TOKEN} from "../scripts/constants.js"
// index.html 화면이 로드되고 2초 뒤 로그인 화면으로 이동
window.onload = setTimeout(splashpage, 2000);

// 토큰이 있는 경우 홈피드로 이동
function splashpage() {
  if(TOKEN != '') {
    location.href = '../pages/4.home.html'
  } else {
    location.href = '../pages/2.login.html'
  }
}
