import { BASE_BACKEND_URL, getCurrentUser } from '../router.js';

export function render() {
  return `
	<div class='user-list'>
    <div class='navigation-bar'>
        <div class='link'>Dashboards</div>
		<div class='link'>Overview</div>
		<div class='link'>Policy</div>
		<div class='link active'>Admin</div>
		<div class='person'>
			<div class='logo'></div>
			<i class='icon-down menu'></i>
		</div>
    </div>
	<div class='action-bar'>
		<div class='action'><i class='icon-filter'></i></div>
		<div class='action'>Overview</div>
		<div class='action active'>Users</div>
		<div class='action'>Groups</div>
	</div>
	<div class='filter-table-bar'>
		<div class='filter active'>
			<div class='status' filter='active'>Active</div>
			<div class='count'>0</div>
		</div>
		<div class='filter'>
			<div class='status' filter='admin'>Admins</div>
			<div class='count'>0</div>
		</div>
		<div class='filter'>
			<div class='status' filter='blocked'>Blocked</div>
			<div class='count'>0</div>
		</div>
		<div class='filter'>
			<div class='status' filter='deleted'>Deleted</div>
			<div class='count'>0</div>
		</div>
		<div class='filter'>
			<button class='new-user'>New user</button>
		</div>
	</div>
	<table class='user-list-table' id='user-lt'>
			<thead>
				<tr>
					<td class='order' column='id'>№<i class='icon-sort'></td>
					<td class='order' column='name'>Name<i class='icon-sort'></td>
					<td class='order' column='created'>Created on<i class='icon-sort'></td>
					<td>Action</td>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
		<div class='footer'>
			<div class='previous'>
				<button id='prev'>Prev</button>
			</div>
			<div class='pages' id='paginator'>
			</div>
			<div class='next'>
				<button id='next'>Next</button>
			</div>
		</div>
</div>
	`;
}

const pageSize = 10;

let pages = [];

export async function prepareModule() {
  document.body.classList.add('no-padding');
  const user = getCurrentUser();
  document.querySelector('.person > .logo').textContent = getInitials(user);
  document.getElementById('next').addEventListener('click', next);
  document.getElementById('prev').addEventListener('click', previous);
  document.querySelectorAll('.filter div.status').forEach(e => e.addEventListener('click', filterClick));
  document.querySelectorAll('#user-lt thead td.order').forEach(e => e.addEventListener('click', columnOrderClick));
  await loadStat();
  await loadData();
}

const filters = {
  'active': {
    'blocked': false,
    'deleted': false
  },
  'admin': {
    'admin': true
  },
  'blocked': {
    'blocked': true
  },
  'deleted': {
    'deleted': true
  }
}

let currentFilter = { filter: filters['active'], key: 'active' };

let pageFilter = {
  page: 1
}

let ordering = []

async function loadData() {
  const response = await fetch(`${BASE_BACKEND_URL}/users?${new URLSearchParams({ ...currentFilter.filter, ...pageFilter, ...{ ordering: ordering.join(',') } })}`, {
    credentials: 'include'
  });

  response.json().then(data => updateTable(data));
}

async function loadStat() {
  const response = await fetch(`${BASE_BACKEND_URL}/stat`, {
    credentials: 'include'
  });

  response.json().then(data => redrawFilter(data));
}

function updateTable(data) {
  const pagesNumber = Math.ceil(data.count / pageSize);
  pages = [];
  for (let i = 1; i <= pagesNumber; i++) {
    pages.push(i);
  }
  redrawPages();
  redrawFilter();
  redrawData(data.results);
}

function redrawPages() {
  const pagesToDraw = (pages.length > 7) ?
    [...pages.slice(0, 3), (pageFilter.page > 3 && pageFilter.page <= pages.length - 3) ? pageFilter.page : '...', ...pages.slice(-3)] : pages;
  document.getElementById('paginator').innerHTML = pagesToDraw.reduce((accum, value) => {
    accum += `<div class='page ${pageFilter.page == value ? 'selected' : ''}'>${value}</div>`;
    return accum;
  }, '');
  document.querySelectorAll('#paginator .page').forEach(el => el.addEventListener('click', pageClick));
}

function redrawData(data) {
  let userTable = document.getElementById('user-lt');
  userTable.tBodies[0].innerHTML = data.reduce((accum, user) => {
    const initials = getInitials(user.name);
    accum += `<tr>
		<td>${user.id}</td>
		<td>
			<div class='user-name'>
				<div class='logo'>${initials}</div>
				<div class='fio'>${user.name}</br><span class='email'>${user.email}</span></div>
				<div class='status ${(user.blocked ? 'blocked' : (user.admin) ? 'admin' : '')}'></div>
			</div>
		</td>
		<td><div class='date'>${new Date(Date.parse(user.created)).toLocaleDateString()}</div></td>
		<td>
		<i class='icon-edit'></i>
		<i class='icon-delete' entityId='${user.id}'></i>
		</td>
	</tr>`
    return accum;
  }, '');
  document.querySelectorAll('#user-lt td i.icon-delete').forEach(e => e.addEventListener('click', remove));

}

function redrawFilter(data) {
  Object.entries(filters).forEach(([key, filter]) => {
    if (data) {
      document.querySelector(`.filter div[filter='${key}']+div.count`).textContent = data.find(stat => stat.status === key).count;
    }
    const filterDom = document.querySelector(`.filter div[filter='${key}']`);
    if (currentFilter.key === key) {
      filterDom.parentElement.classList.add('active');
    }
    else {
      filterDom.parentElement.classList.remove('active');
    }
  });
}

function pageClick($event) {
  pageFilter.page = parseInt($event.target.textContent);
  loadData();
}

function filterClick($event) {
  const clickedFilter = $event.target.getAttribute('filter');
  pageFilter.page = 1;
  currentFilter = { filter: filters[$event.target.getAttribute('filter')], key: clickedFilter };
  loadData();
}

function columnOrderClick($event) {
  const column = $event.target.getAttribute('column')
  if (!ordering.includes(column) && !ordering.includes(`-${column}`)) {
    ordering.push(column);
    $event.target.classList.add('asc');
  }
  else if (ordering.includes(column)) {
    ordering = ordering.filter(o => o !== column);
    ordering.push(`-${column}`);
    $event.target.classList.remove('asc');
    $event.target.classList.add('desc');
  }
  else {
    ordering = ordering.filter(o => o !== `-${column}`);
    $event.target.classList.remove('desc');
  }
  loadData();
}

function previous() {
  if (pageFilter.page > 1) {
    pageFilter.page = pageFilter.page - 1;
    loadData();
  }
}

function next() {
  if (pageFilter.page < pages.length) {
    pageFilter.page = pageFilter.page + 1;
    loadData();
  }
}

async function remove($event) {
  const id = $event.target.getAttribute('entityId');
  if (currentFilter.key !== 'deleted') {
    await fetch(`${BASE_BACKEND_URL}/users/${id}/`, {
      method: 'DELETE',
      credentials: 'include'
    });
    await loadStat();
    loadData();
  }
}

function getInitials(username) {
  return username.split(' ').splice(0, 2).map(name => name[0]).join('');
}