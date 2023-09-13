import { BASE_BACKEND_URL, goTo, setCurrentUser } from "../router.js";

export function render() {
  return `<div class="login-block">
            <div class="login-image"></div>
            <div class="login-form">
                <div class="login-menu">
                    <button class="login-menu-button"></button>
                </div>
                <div class="login-inputs">
                    <form id="login-form">
                        <i class="login-icon icon-globe"></i>
                        <h2>Welcome back!</h2>
                        <h4>log into your dashboard</h4>
                        <div class="row login">
                            <i class="login-form-icon icon-login"></i>
                            <input type="text" id="username" class="login"  autocomplete="off">
                        </div>
                        <div class="row password">
                            <i class="login-form-icon icon-password"></i>
                            <input type="password" id="password" class="password"  autocomplete="off">
                        </div>
                        <div class="row line">
                            <input type="checkbox" checked id="stay-logged">
                            <label for="stay-logged" class="checkbox">stay logged in</label>
                        </div>
                        <div class="row">
                            <button class="login-button" id="login-button">
                                login
                                <i class="icon-arrow-right"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
`;
}

export function prepareModule() {
  document.body.classList.remove('no-padding');
  document.getElementById("login-button").addEventListener("click", login);
}

async function login(event) {
  event.preventDefault();
  const form = document.getElementById('login-form');
  try {
    const response = await postData(`${BASE_BACKEND_URL}/login/`, {
      'username': form.elements.username.value,
      'password': form.elements.password.value
    });

    if (response.Success) {
      setCurrentUser(response.user);
      goTo('/user-list');
    }
    else {
      alert("Авторизация прошла неуспешно!")
    }
  }
  catch (e) {
    alert('Авторизация прошла неуспешно!');
  }

}

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: 'include',
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

