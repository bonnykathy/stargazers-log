const repositoryList = document.querySelector('#repo-list');
const repositoryCount = document.querySelector('#repo-count');

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const numberFormatter = new Intl.NumberFormat('pt-BR');

function formatDate(date) {
  return dateFormatter.format(new Date(date));
}

function createRepositoryItem(event) {
  const { repo } = event;
  const item = document.createElement('li');
  item.className = 'repo';

  item.innerHTML = `
    <div>
      <h2 class="repo-name">
        <a href="${repo.url}" target="_blank" rel="noreferrer">${repo.name}</a>
      </h2>
      <p class="repo-description">${repo.description}</p>
      <div class="repo-meta">
        <span class="language">${repo.language}</span>
        <span aria-label="${numberFormatter.format(repo.stars)} estrelas">★ ${numberFormatter.format(repo.stars)}</span>
      </div>
    </div>
    <time class="repo-date" datetime="${event.created_at}">${formatDate(event.created_at)}</time>
  `;

  return item;
}

async function renderRepositories() {
  try {
    const response = await fetch('events.json');

    if (!response.ok) {
      throw new Error(`Não foi possível carregar os eventos (${response.status}).`);
    }

    const events = await response.json();
    const starEvents = events.filter((event) => event.type === 'StarEvent' && event.repo);

    repositoryCount.textContent = starEvents.length;
    repositoryList.replaceChildren(...starEvents.map(createRepositoryItem));

    if (starEvents.length === 0) {
      repositoryList.innerHTML = '<li class="status">Nenhum repositório favorito encontrado.</li>';
    }
  } catch (error) {
    repositoryCount.textContent = '—';
    repositoryList.innerHTML = '<li class="status error">Não foi possível carregar os repositórios agora.</li>';
    console.error(error);
  }
}

renderRepositories();
