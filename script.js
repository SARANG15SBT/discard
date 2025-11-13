// Global storage for protein data
let proteinData = [];
let currentIndex = 0;
const carouselWrapper = document.getElementById('carouselWrapper');

// ✅ Load protein data from JSON file hosted on GitHub Pages
// Replace with your actual GitHub Pages URL
const jsonURL = 'https://sarang15sbt.github.io/protein-database/proteins.json';

fetch(jsonURL)
  .then(res => res.json())
  .then(data => {
    proteinData = data;
    console.log("Loaded proteins:", proteinData);

    // Render initial carousel with first 3 proteins
    renderCarousel(proteinData.slice(0, 3));
  })
  .catch(err => console.error('Error loading JSON:', err));

// ✅ Render carousel dynamically
function renderCarousel(proteins) {
  carouselWrapper.innerHTML = '';

  proteins.forEach(protein => {
    const card = document.createElement('div');
    card.className = 'protein-card';
    card.innerHTML = `
      <h4>${protein["Dark_protein ID"]}</h4>
      <p><strong>Symbol:</strong> ${protein.ncbi_gene_Symbol}</p>
      <p><strong>Description:</strong> ${protein.Description}</p>
      <p><strong>Organism:</strong> ${protein.TaxonomicName}</p>
      <p><strong>Gene Type:</strong> ${protein.GeneType}</p>
    `;
    carouselWrapper.appendChild(card);
  });
}

// ✅ Carousel navigation
function nextSlide() {
  if (proteinData.length === 0) return;
  currentIndex = (currentIndex + 1) % proteinData.length;
  const slice = proteinData.slice(currentIndex, currentIndex + 3);
  renderCarousel(slice.length ? slice : proteinData.slice(0, 3));
}

function prevSlide() {
  if (proteinData.length === 0) return;
  currentIndex = (currentIndex - 1 + proteinData.length) % proteinData.length;
  const slice = proteinData.slice(currentIndex, currentIndex + 3);
  renderCarousel(slice.length ? slice : proteinData.slice(0, 3));
}

// ✅ Search function with category
function performSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categorySelect').value.toLowerCase();

  const results = proteinData.filter(protein => {
    const matchesQuery = query
      ? (protein["Dark_protein ID"].toLowerCase().includes(query) ||
         protein.ncbi_gene_Symbol.toLowerCase().includes(query) ||
         protein.Description.toLowerCase().includes(query) ||
         protein.TaxonomicName.toLowerCase().includes(query) ||
         protein.GeneType.toLowerCase().includes(query))
      : true;

    const matchesCategory = category
      ? protein.GeneType.toLowerCase() === category
      : true;

    return matchesQuery && matchesCategory;
  });

  console.log("Search results:", results);

  // ✅ Open results in a new tab
  const resultTab = window.open("", "_blank");
  resultTab.document.write(`
    <html>
    <head>
      <title>Search Results</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background-color: #333; color: white; }
      </style>
    </head>
    <body>
      <h2>Search Results</h2>
      <table>
        <thead>
          <tr>
            <th>Protein ID</th>
            <th>Symbol</th>
            <th>Description</th>
            <th>Organism</th>
            <th>Gene Type</th>
          </tr>
        </thead>
        <tbody>
          ${results.map(protein => `
            <tr>
              <td>${protein["Dark_protein ID"]}</td>
              <td>${protein.ncbi_gene_Symbol}</td>
              <td>${protein.Description}</td>
              <td>${protein.TaxonomicName}</td>
              <td>${protein.GeneType}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `);
}


function renderTable(results) {
  const tbody = document.querySelector('#resultsTable tbody');
  tbody.innerHTML = '';

  results.forEach(protein => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${protein["Dark_protein ID"]}</td>
      <td>${protein.ncbi_gene_Symbol}</td>
      <td>${protein.Description}</td>
      <td>${protein.TaxonomicName}</td>
      <td>${protein.GeneType}</td>
    `;
    tbody.appendChild(row);
  });
}




