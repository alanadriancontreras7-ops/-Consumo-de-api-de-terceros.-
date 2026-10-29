const API_URL = 'https://rickandmortyapi.com/api/character';

const gridContainer = document.getElementById('characters-grid');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const loadingElement = document.getElementById('loading');
const errorMessageElement = document.getElementById('error-message');

/**
 * Realiza la petición a la API de terceros procesando la respuesta en formato JSON
 * @param {string} characterName - Nombre del personaje a buscar (opcional)
 */
async function fetchCharacters(characterName = '') {
  try {
    showLoading(true);
    hideError();
    gridContainer.innerHTML = '';

    const url = characterName 
      ? `${API_URL}/?name=${encodeURIComponent(characterName)}`
      : API_URL;

    const response = await fetch(url);

    // Validación del código de estado HTTP
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('No se encontraron personajes con ese nombre.');
      }
      throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    renderCharacters(data.results);

  } catch (error) {
    showError(error.message);
  } finally {
    showLoading(false);
  }
}

/**
 * Renderiza dinámicamente las tarjetas en el DOM
 * @param {Array} characters 
 */
function renderCharacters(characters) {
  characters.forEach(character => {
    const card = document.createElement('article');
    card.className = 'card';

    card.innerHTML = `
      <img src="${character.image}" alt="${character.name}">
      <div class="card-info">
        <h3>${character.name}</h3>
        <span class="status ${character.status}">${character.status}</span>
        <p><strong>Especie:</strong> ${character.species}</p>
        <p><strong>Origen:</strong> ${character.origin.name}</p>
      </div>
    `;

    gridContainer.appendChild(card);
  });
}

function showLoading(isLoading) {
  if (isLoading) {
    loadingElement.classList.remove('hidden');
  } else {
    loadingElement.classList.add('hidden');
  }
}

function showError(message) {
  errorMessageElement.textContent = message;
  errorMessageElement.classList.remove('hidden');
}

function hideError() {
  errorMessageElement.classList.add('hidden');
  errorMessageElement.textContent = '';
}

// Event Listeners
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  fetchCharacters(query);
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim();
    fetchCharacters(query);
  }
});

// Carga inicial al abrir la página
document.addEventListener('DOMContentLoaded', () => fetchCharacters());