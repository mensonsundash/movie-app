class Movie {
    constructor(title, genre, releaseYear) {
        this.title = title;
        this.genre = genre;
        this.releaseYear = releaseYear;
    }
    

    getInfo() {
        return `${this.title} is a ${this.genre} movie released in ${this.releaseYear}`;
    }
}

let movies = [];

function addMovie() {
    let title = document.getElementById('movieTitle').value;
    let genre = document.getElementById('movieGenre').value;
    let year = parseInt(document.getElementById('releaseYear').value);

    //checking for empty fields
    if(!title || !genre || isNaN(year)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    //creating object and add new Movies into array
    const newMovie = new Movie(title, genre, year);
    movies.push(newMovie);

    //saving your pushed data into locastorage
    localStorage.setItem("movies", JSON.stringify(movies));


    displayMovies();

    //clear form inputs
    title = '';
    genre = '';
    year = '';
}

function displayMovies(){
    const list = document.getElementById('movieList');
    
    list.innerHTML = ''; //Clear old lines

    for(let movie of movies) {
        const li = document.createElement('li');

        li.textContent = movie.getInfo();
        list.appendChild(li);
    }
}