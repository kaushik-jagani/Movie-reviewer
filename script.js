
    const APIURL =
`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1`;
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
    "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const currentPageElement = document.getElementById("currentPage");
const totalPagesElement = document.getElementById("totalPages");
const paginationButtonsContainer = document.getElementById("pagination-buttons");

// initially get fav movies
// getMovies(APIURL);

// async function getMovies(url) {
//     const resp = await fetch(url);
//     const respData = await resp.json();

//     console.log(respData);

//     showMovies(respData.results);
// }

function showMovies(movies) {
    // clear main
    main.innerHTML = "";

    movies.forEach((movie) => {
        const { poster_path, title, vote_average, overview } = movie;

        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");

        movieEl.innerHTML = `
            <img
                src="${IMGPATH + poster_path}"
                alt="${title}"
            />
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(
                    vote_average
                )}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview:</h3>
                ${overview}
            </div>
        `;

        main.appendChild(movieEl);
    });
}

function getClassByRate(vote) {
    if (vote >= 8) {
        return "green";
    } else if (vote >= 5) {
        return "orange";
    } else {
        return "red";
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm) {
        getMovies(SEARCHAPI + searchTerm);

        search.value = "";
    }
});


//pagination
let currentPage = 1;
let totalPages = 1;


prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        getMovies(APIURL + `&page=${currentPage}`);
        updatePagination();
    }
});

nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        getMovies(APIURL + `&page=${currentPage}`);
        updatePagination();
    }
});

async function getMovies(url) {
    const resp = await fetch(url);
    const respData = await resp.json();

    console.log(respData);
     totalPages = respData.total_pages;
    // updatePaginationInfo(currentPage, totalPages);
    updatePagination();
    showMovies(respData.results);
   
}

function updatePaginationInfo(currentPage, totalPages) {
    currentPageElement.textContent = currentPage;
    totalPagesElement.textContent = totalPages;
}


function updatePagination() {
    paginationButtonsContainer.innerHTML = "";

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            createPaginationButton(i);
        }
    } else {
        if (currentPage <= 4) {
            for (let i = 1; i <= 6; i++) {
                createPaginationButton(i);
            }
            paginationButtonsContainer.innerHTML += `<span>...</span>`;
            createPaginationButton(totalPages);
        } else if (currentPage >= totalPages - 3) {
            createPaginationButton(1);
            paginationButtonsContainer.innerHTML += `<span>...</span>`;
            for (let i = totalPages - 5; i <= totalPages; i++) {
                createPaginationButton(i);
            }
        } else {
            createPaginationButton(1);
            paginationButtonsContainer.innerHTML += `<span>...</span>`;
            for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                createPaginationButton(i);
            }
            paginationButtonsContainer.innerHTML += `<span>...</span>`;
            createPaginationButton(totalPages);
        }
    }
    // getMovies(APIURL + `&page=${currentPage}`);
}

function createPaginationButton(pageNumber) {
    const button = document.createElement("button");
    button.textContent = pageNumber;
    button.addEventListener("click", () => {
        currentPage = pageNumber;
        updatePagination();
        getMovies(APIURL + `&page=${currentPage}`);
        
    });
    if (pageNumber === currentPage) {
        button.classList.add("active");
    }
    paginationButtonsContainer.appendChild(button);
}
getMovies(APIURL + `&page=${currentPage}`);