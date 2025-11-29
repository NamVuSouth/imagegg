async function searchImages() {
  const query = document.getElementById('query').value;
  if (!query) return;

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = 'Loading...';

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.results) {
      resultsDiv.innerHTML = data.results
        .map(img => `<img src="${img.urls.small}" alt="${img.alt_description}">`)
        .join('');
    } else {
      resultsDiv.innerHTML = 'No images found.';
    }
  } catch (err) {
    console.error(err);
    resultsDiv.innerHTML = 'Error fetching images';
  }
}
