// -------------------- State --------------------
let proteinData = [];
let dataReady = false;

// -------------------- Helpers --------------------
const toLower = v => (v ?? '').toString().trim().toLowerCase();

function normalizeRecord(p) {
  return {
    id: p?.['Dark_protein ID'] ?? '',
    symbol: p?.['ncbi_gene_Symbol'] ?? '',
    description: p?.['Description'] ?? p?.['ncbi_gene_Description'] ?? '',
    taxonomicName: p?.['TaxonomicName'] ?? '',
    geneType: p?.['GeneType'] ?? '',
    raw: p
  };
}

function ensureArray(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') return [data];
  return [];
}

// -------------------- Filtering --------------------
function filterResults(category, query) {
  return proteinData.filter(p => {
    const matchesQuery = query
      ? (
          toLower(p.id).includes(query) ||
          toLower(p.symbol).includes(query) ||
          toLower(p.description).includes(query) ||
          toLower(p.taxonomicName).includes(query) ||
          toLower(p.geneType).includes(query)
        )
      : true;

    const matchesCategory = category ? toLower(p.geneType).includes(category) : true;
    return matchesQuery && matchesCategory;
  });
}

// -------------------- Render full page --------------------
function renderPage(results) {
  // Replace the entire body with only results
  document.body.innerHTML = `
    <h2 style="text-align:center;">Search Results</h2>
    <table border="1" style="width:100%; border-collapse:collapse;">
      <thead>
        <tr>
          <th>ID</th>
          <th>Symbol</th>
          <th>Description</th>
          <th>Organism</th>
          <th>Gene Type</th>
        </tr>
      </thead>
      <tbody>
        ${
          results.length
            ? results.map(p => `
              <tr>
                <td>${p.id}</td>
                <td>${p.symbol}</td>
                <td>${p.description}</td>
                <td>${p.taxonomicName}</td>
                <td>${p.geneType}</td>
              </tr>
            `).join('')
            : `<tr><td colspan="5" style="text-align:center;">No results found</td></tr>`
        }
      </tbody>
    </table>
    <div style="text-align:center; margin-top:20px;">
      <button onclick="window.location.href=window.location.pathname">Back to full list</button>
    </div>
  `;
}

// -------------------- Search trigger --------------------
function performSearch() {
  const category = toLower(document.getElementById('categorySelect')?.value);
  const query = toLower(document.getElementById('searchInput')?.value);

  const results = filterResults(category, query);
  renderPage(results);
}

// -------------------- Load & boot --------------------
document.addEventListener('DOMContentLoaded', () => {
  const jsonURL = 'https://sarang15sbt.github.io/protein-database/proteins.json';

  fetch(jsonURL)
    .then(res => res.json())
    .then(data => {
      proteinData = ensureArray(data).map(normalizeRecord);
      dataReady = true;

      // Wire up search button
      const searchBtn = document.querySelector('.search-bar button');
      if (searchBtn) searchBtn.addEventListener('click', performSearch);

      // Wire up dropdown
      const categoryEl = document.getElementById('categorySelect');
      if (categoryEl) categoryEl.addEventListener('change', performSearch);

      // Initial view: show full table
      renderPage(proteinData);
    })
    .catch(err => {
      console.error('Error loading JSON:', err);
      renderPage([]);
    });
});
