import { render as LoginRender, prepareModule as LoginPrepareModule } from './views/login.js';
import { render as UserListRender, prepareModule as UserListPrepareModule } from './views/user-list.js';

export const BASE_BACKEND_URL = 'http://localhost:8090';

export async function router() {
  let view = routes[location.pathname] || getDefaultView();
  try {
    await getRequest(`${BASE_BACKEND_URL}/checkLogin/`);
    if (view.code === 'login') {
      view = getDefaultView()
    }
  }
  catch (e) {
    view = routes['/login'];
  }

  if (view) {
    document.title = view.title;
    app.innerHTML = view.render();
    history.pushState(null, '', Object.keys(routes).find(key => routes[key].code === view.code));
    await view.prepare();
  } else {
    history.replaceState('', '', '/');
    router();
  }
};

function getDefaultView() {
  return Object.entries(routes).find(([key, value]) => value.defaultView)[1];
}

async function getRequest(url) {
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  if (response.status !== 200) {
    throw new Error({ 'message': 'unlogged' })
  }
  return response.json(); // parses JSON response into native JavaScript objects
}

export const routes = {
  '/login': { title: 'Login', code: 'login', render: LoginRender, prepare: LoginPrepareModule, isAuthenticated: false },
  '/user-list': { title: 'Users List', code:'user-list', render: UserListRender, prepare: UserListPrepareModule, isAuthenticated: true, defaultView: true }
};


export async function goTo(link) {
  history.pushState(null, '', 'link');
  router();
}

let currentUser;
export function setCurrentUser(user) {
  localStorage.setItem('userName', user);
  currentUser = user;
}

export function getCurrentUser() {
  return currentUser || localStorage.getItem('userName');
}