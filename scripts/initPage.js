import { TOKEN, ACCOUNT_NAME } from "./constants.js";
import {
	checkEmailValid,
	imageUpload,
	checkUserIdValid,
	join,
	getFeed,
	login,
	getAccount,
	getFollowingList,
	getProfile,
	getFollowing,
	getFollower,
	loadUserData,
	updateProfile,
	profileImage,
} from "./api.js";
import { API_URL } from "./constants.js";

let loc = [];
if (document.location.href.includes("/pages")) {
	loc = document.location.href.split("/pages/")[1];
	if (loc.includes("?")) {
		loc = loc.split("?")[0];
	}
}
console.log(loc);
switch (loc) {
	case "2.login_email.html":
		loginPage();
		break;
	case "2.login.html":
		loginPage();
		break;
	case "3.join_email.html":
		joinPage();
		break;
	case "4.home.html":
		homePage();
		break;
	case "5.search.html":
		searchPage();
		break;
	case "6.profile.html":
		profilePage();
		break;
	case "7.followers.html":
		followPage();
		break;
	case "8.profile_modification.html":
		profileModifyPage();
		break;
	default:
		splashPage();
		break;
}

function splashPage() {
	// index.html 화면이 로드되고 2초 뒤 로그인 화면으로 이동
	window.onload = setTimeout(splashpage, 1000);
	// 토큰이 있는 경우 홈피드로 이동
	function splashpage() {
		if (TOKEN != "") {
			location.href = "pages/4.home.html";
		} else {
			location.href = "pages/2.login.html";
		}
	}
}

function loginPage() {
	const loginEmailInput = document.querySelector("#login-cont-email");
	const loginPwdInput = document.querySelector("#login-cont-pwd");
	const loginSubmit = document.querySelector(".login-submit");

	// 입력을 완료한 경우 버튼 활성화
	// 아이디 입력
	if (loginEmailInput)
		loginEmailInput.addEventListener("input", function () {
			if (loginEmailInput.value === "" && loginPwdInput === "") {
				loginSubmit.disabled = true;
			} else if (loginEmailInput.value === "" || loginPwdInput.value === "") {
				loginSubmit.disabled = true;
			} else {
				loginSubmit.disabled = false;
				loginSubmit.classList.remove("disabled");
			}
		});

	// 비밀번호 입력
	if (loginPwdInput)
		loginPwdInput.addEventListener("input", function () {
			if (loginEmailInput.value === "" && loginPwdInput === "") {
				loginSubmit.disabled = true;
			} else if (loginEmailInput.value === "" || loginPwdInput.value === "") {
				loginSubmit.disabled = true;
			} else {
				loginSubmit.disabled = false;
				loginSubmit.classList.remove("disabled");
			}
		});

	const $loginBtn = document.querySelector(".login-submit");
	if ($loginBtn) {
		$loginBtn.addEventListener("click", login);
	}
}

function joinPage() {
	const joinEmailInput = document.querySelector("#join-cont-email");
	const joinPwdInput = document.querySelector("#join-cont-pwd");
	const joinBtnNext = document.querySelector(".join-next");
	const emailWarnTxt = document.querySelector(".login-email-warn");
	const pwdWarnTxt = document.querySelector(".login-pwd-warn");
	const joinBtnSubmit = document.querySelector(".submit-btn");

	// 포커스를 잃었을 때 유효성 검사
	// 이메일 형식 유효성 검사
	joinEmailInput.addEventListener("focusout", async () => {
		const email = joinEmailInput.value;
		const regExp = new RegExp("^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+.[A-Za-z0-9-]+");

		const validEmail = await checkEmailValid(email);
		if (validEmail && email != "" && regExp.test(email) == true) {
			emailWarnTxt.classList.remove("txt-hide", "login-warn");
			emailWarnTxt.innerText = "* 사용 가능한 이메일 입니다.";
		} else if (!regExp.test(email)) {
			emailWarnTxt.classList.remove("txt-hide");
			emailWarnTxt.classList.add("on");
			emailWarnTxt.innerText = "* 이메일 형식이 아닙니다.";
		} else {
			emailWarnTxt.innerText = "* 이미 가입된 이메일 주소입니다.";
			emailWarnTxt.classList.remove("txt-hide");
			emailWarnTxt.classList.add("on");
		}
	});

	joinPwdInput.addEventListener("focusout", async () => {
		const pw = joinPwdInput.value;
		if (pw === "") {
			pwdWarnTxt.classList.remove("txt-hide");
			pwdWarnTxt.classList.add("on");
		} else if (pw.length > 5) {
			joinBtnNext.classList.remove("disabled");
			joinBtnNext.disabled = false;
			pwdWarnTxt.classList.add("txt-hide");
		} else {
			pwdWarnTxt.innerText = "* 비밀번호는 6자 이상이어야 합니다.";
			pwdWarnTxt.classList.remove("txt-hide");
			pwdWarnTxt.classList.add("on");
		}
	});

	// 다음 버튼 클릭시 프로필 설정
	joinBtnNext.addEventListener("click", () => {
		document.querySelector("#setProfile").style.display = "block";
		document.querySelector("#emailJoinin").style.display = "none";
	});

	// join_membership
	const joinUserIdInput = document.querySelector("#user-id");
	const profileWarn = document.querySelector(".profile-warn");

	document.querySelector("#upload-profile").addEventListener("change", profileImage);

	// 계정 ID 포커스 잃었을때 유효성 검사
	joinUserIdInput.addEventListener("focusout", async () => {
		const userId = joinUserIdInput.value;
		const regExp = new RegExp("^[a-zA-Z0-9_.]+$");

		const validUserId = await checkUserIdValid(userId);
		// console.log(validUserId);
		if (!validUserId && userId != "" && regExp.test(userId) == true) {
			profileWarn.classList.remove("txt-hide");
			profileWarn.classList.remove("on");
			profileWarn.innerText = "* 사용 가능한 아이디 입니다.";
		} else if (!regExp.test(userId)) {
			profileWarn.classList.remove("txt-hide");
			profileWarn.classList.add("on");
			profileWarn.innerText = "* 영문, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.";
		} else {
			profileWarn.classList.remove("txt-hide");
			profileWarn.classList.add("on");
			profileWarn.innerText = "* 이미 사용중인 아이디 입니다.";
		}
	});

	joinBtnSubmit.addEventListener("click", join);
}

function homePage() {
	// home
	if (TOKEN) {
		getFeed();
	} else {
		location.href = "./2.login.html";
	}
}

function searchPage() {
	const input = document.querySelector("#search-id");

	if (input)
		input.addEventListener("keyup", (e) => {
			getAccount(e.currentTarget);
		});
}

function profilePage() {
	let targetAccount = ACCOUNT_NAME;
	let isMyprofile = false;

	if (location.search != "") {
		targetAccount = location.search.replace("?", "");
		// 로그인 정보와 프로필이 일치
		if (ACCOUNT_NAME == targetAccount) {
			isMyprofile = true;
		}
		console.log(isMyprofile);
		document.querySelector(".cont-followers").href = `7.followers.html?${targetAccount}?follower`;
		document.querySelector(".cont-followings").href = `7.followers.html?${targetAccount}?following`;
	} else {
		document.querySelector(".cont-followers").href = `7.followers.html?${ACCOUNT_NAME}?follower`;
		document.querySelector(".cont-followings").href = `7.followers.html?${ACCOUNT_NAME}?following`;
	}
	getProfile(targetAccount);
	getFollowingList();

	const btnViewList = document.querySelector("#toggle-list"); // 목록형 버튼
	const btnViewAlbum = document.querySelector("#toggle-album"); // 앨범형 버튼
	const viewList = document.querySelector(".list-post"); // 목록형 보기
	const viewAlbum = document.querySelector(".grid-post"); // 앨범형 보기

	// 목록형, 앨범형 토글
	function toggleView(show, hide) {
		show.firstElementChild.classList.toggle("off-view");
		show.firstElementChild.classList.toggle("on-view");
		show.lastElementChild.classList.toggle("on-view");
		show.lastElementChild.classList.toggle("off-view");

		hide.firstElementChild.classList.toggle("on-view");
		hide.firstElementChild.classList.toggle("off-view");
		hide.lastElementChild.classList.toggle("off-view");
		hide.lastElementChild.classList.toggle("on-view");
	}

	btnViewList.addEventListener("click", () => {
		if (btnViewList.firstElementChild.classList.contains("off-view")) {
			toggleView(btnViewList, btnViewAlbum);
			viewList.style.display = "block";
			viewAlbum.style.display = "none";
		}
	});

	btnViewAlbum.addEventListener("click", () => {
		if (btnViewAlbum.firstElementChild.classList.contains("off-view")) {
			toggleView(btnViewAlbum, btnViewList);
			viewAlbum.style.display = "grid";
			viewList.style.display = "none";
		}
	});
}

function followPage() {
	const tit_txt = document.querySelector(".tit-follow");
	let option = "";
	if (location.search != "") {
		option = location.search.replace("?", "");
		option = option.split("?");
	}
	if (option[1] === "follower") {
		getFollower(option[0]);
	} else if (option[1] === "following") {
		getFollowing(option[0]);
		tit_txt.textContent = "Following";
	} else {
		history.back();
	}
}

function profileModifyPage() {
	// profile_modification.html
	const uAccount = document.querySelector("#user-id");
	const btnSave = document.querySelector(".profile-save");
	const profileWarn = document.querySelector(".profile-warn");

	loadUserData();
	document.querySelector("#upload-profile").addEventListener("change", profileImage);
	btnSave.addEventListener("click", updateProfile);

	// // 계정 ID 포커스 잃었을때 유효성 검사
	uAccount.addEventListener("focusout", async () => {
		const userId = uAccount.value;
		// console.log(userId);
		const regExp = new RegExp("^[a-zA-Z0-9_.]+$");

		const validUserId = await checkUserIdValid(userId);
		// console.log(validUserId);
		if (!validUserId && userId != "" && regExp.test(userId) == true) {
			profileWarn.classList.remove("txt-hide");
			profileWarn.classList.remove("on");
			profileWarn.innerText = "* 사용 가능한 아이디 입니다.";
			btnSave.disabled = false;
			btnSave.classList.remove("disabled");
		} else if (!regExp.test(userId)) {
			profileWarn.classList.remove("txt-hide");
			profileWarn.classList.add("on");
			profileWarn.innerText = "* 영문, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.";
			btnSave.disabled = true;
			btnSave.classList.add("disabled");
		} else {
			profileWarn.classList.remove("txt-hide");
			profileWarn.classList.add("on");
			profileWarn.innerText = "* 이미 사용중인 아이디 입니다.";
			btnSave.disabled = true;
			btnSave.classList.add("disabled");
		}
	});
}
