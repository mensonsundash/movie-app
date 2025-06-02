class Movie {
    constructor(title, genre, year, rating) {
        this.title = title;
        this.genre = genre;
        this.year = year;
        this.rating = rating;
    }
    

    getInfo() {
        // return `
        // <div class="movie-details">
        //     <strong>${this.title}</strong>
        //     <span>${this.genre} | ${this.year}</span>
        // </div>
        // `;
        return `${this.title} is a ${this.genre} movie released in ${this.year}. Rating: ${this.rating}`;
    }
}

let movies = [];
let editingIndex = -1;// -1 means not editing
let sortAscending = true; //sortby year
//load movies from localstorage when the page loads
//using window.onload assigned with callback function
window.onload = function () {
    const saved =  localStorage.getItem('movies');

    if(saved){
        
        //Since JSON.parse() turns class instances into plain objects.Like this==> [{...}]
        const parsed = JSON.parse(saved);
        
        //Thus we need to rebuild them into Movie objects using .map() like this==>[Movie] so .getInfo() works in displayMovies()
        movies = parsed.map(m => new Movie(m.title, m.genre, m.year, m.rating));
        
        displayMovies();
    }
}

function addMovie() {
    let title = document.getElementById('movieTitle').value.trim();
    let genre = document.getElementById('movieGenre').value.trim();
    let year = parseInt(document.getElementById('year').value);
    let rating =parseFloat(document.getElementById('movieRating').value);

    //checking for empty fields
    if(!title || !genre || isNaN(year) || isNaN(rating)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    //creating object and add new Movies into array
    const newMovie = new Movie(title, genre, year, rating);
    movies.push(newMovie);

    //saving your pushed data into locastorage
    //as localStorage can only stores string, we need to stringify/parse using JSON 
    localStorage.setItem("movies", JSON.stringify(movies));


    displayMovies();

    //clear form inputs
    document.getElementById('movieTitle').value = '';
    document.getElementById('movieGenre').value = '';
    document.getElementById('year').value = '';
    document.getElementById('rating').value = '';

    //clearing filter selection to ALL
    document.getElementById('genreFilter').value = 'all';
}



function deleteMovie(index)  {
    console.log("Delete val: ", index);
    movies.splice(index,1);
    localStorage.setItem("movies", JSON.stringify(movies)); //update storage
    displayMovies();
}



function editMovie(index) {
    const movie = movies[index];//retreive movies data array using its index

    document.getElementById('movieTitle').value = movie.title;
    document.getElementById('movieGenre').value = movie.genre;
    document.getElementById('year').value  = movie.year;
    document.getElementById('rating').value = movie.rating;

    editingIndex = index;

    const addBtn = document.querySelector('button[onclick="addMovie()"]');
    addBtn.textContent = "Update Movie";
    addBtn.onclick = updateMovie;
}

function updateMovie() {
    const title = document.getElementById('movieTitle').value.trim();
    const genre = document.getElementById('movieGenre').value.trim();
    const year = parseInt(document.getElementById('year').value);
    const rating = parseFloat(document.getElementById('rating').value);// ;

    if(!title || !genre || isNaN(year) || isNaN(rating)) {
        alert("Please fill in all fields correctly by Click update on list.");
        return;
    }

    //update the selected movie
    movies[editingIndex] = new Movie(title, genre, year, rating);

    //save and refresh
    localStorage.setItem("movies", JSON.stringify(movies));
    displayMovies();
    //reset form
    document.getElementById('movieTitle').value = '';
    document.getElementById('movieGenre').value = '';
    document.getElementById('year').value = '';
    document.getElementById('rating').value = '';

    //clearing filter selection to ALL
    document.getElementById('genreFilter').value = 'all';

    editingIndex = -1;

    //restore add Movie button
    const addBtn = document.querySelector('button[onclick="updateMovie()"]');

    addBtn.textContent = "Add Movie";
    addBtn.setAttribute("onclick", "addMovie()");

}

//function with accpeting an optional array (for filtering)
function displayMovies(movieArray = movies){
    const list = document.getElementById('movieList');
    
    list.innerHTML = ''; //Clear old lines

    let oldMoives = getOldestMovie(movieArray);
    
    let averageRating = getAverageRating(movieArray)

    let topRated = getTopRatedMovie(movieArray)
    console.log("averageRating: -->", averageRating)
    console.log("toprated: -->", topRated)

    movieArray.forEach((movie, index) => {
    
        const li = document.createElement('li');
        li.className = "movie-card";
        
        //highlight background of oldest movie
        if(movie.year === oldMoives.year) {
            li.style.backgroundColor = "#404040";
        }
        
        const div1 = document.createElement('div');
        div1.className = "movie-details";
        div1.textContent = movie.getInfo();

        const div2 = document.createElement('div');
        div2.className = "movie-actions";

        //create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = "delete-button";
        deleteBtn.textContent = "❌ Delete";
        deleteBtn.onclick = function () {
            deleteMovie(index);
        };

        //create edit button
        const editBtn = document.createElement('button');
        editBtn.className = "edit-button";
        editBtn.textContent = "✏️ Edit";
        editBtn.onclick = function() {
            editMovie(index)
        };
        
        li.appendChild(div1);
            div2.appendChild(editBtn);
            div2.appendChild(deleteBtn);
        li.appendChild(div2);
        
        list.appendChild(li);
    });

}

//function to search movies
function searchMovies() {
    
    const querySearch = document.getElementById('searchInput').value.toLowerCase();

    
    const filtered = movies.filter(movie => movie.title.toLowerCase().includes(querySearch) || movie.genre.toLowerCase().includes(querySearch));

    console.log(filtered)

    displayMovies(filtered);
}

//function to filter by dropdown selection
function filterByGenre() {
    const selectedGenre = document.getElementById('genreFilter').value.toLowerCase();

    if(selectedGenre === "all"){
        displayMovies();
        return;

    }

    const filtered = filterMovieByGenre(movies, selectedGenre, true);
    // const filtered = movies.filter(movie => movie.genre.toLowerCase().includes(selectedGenre));
    displayMovies(filtered);
}

//function to filter movie by partial and full match movie by genre
function filterMovieByGenre(movies, genre, partial = false) {
    const inputGenre = genre.toLowerCase();
    return movies.filter(movie => {
        const movieGenre = movie.genre.toLowerCase();
        return partial ? movieGenre.includes(inputGenre) : movieGenre === inputGenre;
    }).map(movie => movie);
}

//toogle function sorting by year
function toggleSort() {
    sortAscending = !sortAscending;

    //using spread operator (...movies) to avoid mutating the original list.
    const sorted = [...movies].sort((a,b) => {
        return sortAscending ? a.year - b.year : b.year - a.year;
    });

    const sortBtn = document.getElementById('sortButton');

    sortBtn.textContent = sortAscending ? "Sort by Year ↑" : "Sort by Year ↓";

    displayMovies(sorted);
}

//function to check for oldest movie
function getOldestMovie(movies) {

    //error handling
    if (!movies || movies.length === 0) {
        return null;
    }

    return movies.reduce((oldest, current) => {
        return current.year <= oldest.year ? current : oldest;
    });
}

//returns average rating movie
function getAverageRating(movies) {
    
    let totalRating = parseFloat(0);

    const movieCount = movies.length;

    movies.forEach((movie) => {
        totalRating += parseFloat(movie.rating);
    });

    //console.log(`Total Rating: ${totalRating}, on Count: ${movieCount}`)
    const averageRating = totalRating/movieCount; 

    return averageRating;
}

function getTopRatedMovie(movies) {
    return movies.reduce((topRated, current) => {
        return current.rating >= topRated.rating ? current : topRated; 
    })
}

