const searchForm = document.querySelector('form');
const movieContainer = document.querySelector('.movie-container');
const inputBox = document.querySelector('.inputBox');
const recentList = document.getElementById('recentList');
const themeToggleBtn = document.getElementById('themeToggle');

// Fetch movie details using OMDB API
const getMovieInfo = async (movie) => {
    try {
        const myAPIKey = "1f81128d";
        const url = `https://www.omdbapi.com/?apikey=${myAPIKey}&t=${movie}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Unable to fetch movie data.");
        const data = await response.json();
        if (data.Response === "False") throw new Error(data.Error);
        saveRecentSearch(movie);
        showMovieData(data);
    } catch (error) {
        showErrorMessage("No Movie Found!!!");
    }
};

// Display movie info on the screen
const showMovieData = (data) => {
    movieContainer.innerHTML = "";
    movieContainer.classList.remove("noBackground");

    const { Title, imdbRating, Genre, Released, Runtime, Actors, Plot, Poster } = data;

    // Convert rating to a number and determine its color
    const rating = parseFloat(imdbRating);
    let ratingColor = "";
    if (rating >= 8) ratingColor = "green";
    else if (rating >= 5) ratingColor = "orange";
    else ratingColor = "red";

    // Create movie info element
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie-info');

    // Build inner HTML with rating color and trailer button
    movieElement.innerHTML = `
        <h2>${Title}</h2>
        <p><strong>Released:</strong> ${Released}</p>
        <p><strong>Genre:</strong> ${Genre}</p>
        <p><strong>Actors:</strong> ${Actors}</p>
        <p><strong>Plot:</strong> ${Plot}</p>
        <p>
          <strong>Rating: &#11088;</strong> 
          <span style="
                background-color: ${ratingColor};
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 600;
          ">
                ${rating}
          </span>
        </p>
        <p>
          <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(Title + ' official trailer')}" target="_blank">
            Watch Trailer
          </a>
        </p>
    `;

    // Create movie genre element (optional, if you want a separate block)
    const movieGenreElement = document.createElement('div');
    movieGenreElement.classList.add('movie-genre');
    Genre.split(",").forEach(genre => {
        const p = document.createElement('p');
        p.innerText = genre.trim();
        movieGenreElement.appendChild(p);
    });

    // Create poster element
    const moviePosterElement = document.createElement('div');
    moviePosterElement.classList.add('movie-poster');
    moviePosterElement.innerHTML = `<img src="${Poster}" alt="${Title} Poster" />`;

    // Append the genre element into movie info if needed
    movieElement.appendChild(movieGenreElement);

    // Append poster and info to the main container
    movieContainer.appendChild(moviePosterElement);
    movieContainer.appendChild(movieElement);
};

// Show loading or error message
const showErrorMessage = (message) => {
    movieContainer.innerHTML = `<h2>${message}</h2>`;
    movieContainer.classList.add("noBackground");
};

// Save recent search to localStorage
const saveRecentSearch = (movie) => {
    let searches = getRecentSearches();
    searches = searches.filter(item => item.toLowerCase() !== movie.toLowerCase());
    searches.unshift(movie);
    if (searches.length > 5) searches.pop();
    localStorage.setItem("recentSearches", JSON.stringify(searches));
    renderRecentSearches();
};

// Get recent searches from localStorage
const getRecentSearches = () => {
    const searches = localStorage.getItem("recentSearches");
    return searches ? JSON.parse(searches) : [];
};

// Render recent searches list
const renderRecentSearches = () => {
    recentList.innerHTML = "";
    const searches = getRecentSearches();
    searches.forEach(movie => {
        const li = document.createElement('li');
        li.innerText = movie;
        li.addEventListener('click', () => {
            inputBox.value = movie;
            showErrorMessage("Fetching Movie Information...");
            getMovieInfo(movie);
        });
        recentList.appendChild(li);
    });
};

// Handle search form submission
const handleFormSubmission = (e) => {
    e.preventDefault();
    const movieName = inputBox.value.trim();
    if (movieName !== '') {
        showErrorMessage("Fetching Movie Information...");
        getMovieInfo(movieName);
    } else {
        showErrorMessage("Enter movie name to get movie information");
    }
};

// Toggle light/dark mode
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Show recent on input focus
inputBox.addEventListener('focus', () => {
    recentList.classList.add('active');
    renderRecentSearches();
});
inputBox.addEventListener('blur', () => {
    setTimeout(() => {
        recentList.classList.remove('active');
    }, 150);
});

// Add event listener to search form
searchForm.addEventListener('submit', handleFormSubmission);



