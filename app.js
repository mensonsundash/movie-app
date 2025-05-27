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

//load movies from localstorage when the page loads
//using window.onload assigned with callback function
window.onload = function () {
    const saved =  localStorage.getItem('movies');

    if(saved){
        
        //Since JSON.parse() turns class instances into plain objects.Like this==> [{...}]
        const parsed = JSON.parse(saved);
        
        //Thus we need to rebuild them into Movie objects using .map() like this==>[Movie] so .getInfo() works in displayMovies()
        movies = parsed.map(m => new Movie(m.title, m.genre, m.releaseYear));
        
        displayMovies();
    }
}

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
    //as localStorage can only stores string, we need to stringify/parse using JSON 
    localStorage.setItem("movies", JSON.stringify(movies));


    displayMovies();

    //clear form inputs
    document.getElementById('movieTitle').value = '';
    document.getElementById('movieGenre').value = '';
    document.getElementById('releaseYear').value = '';
}

function displayMovies(){
    const list = document.getElementById('movieList');
    
    list.innerHTML = ''; //Clear old lines

    movies.forEach((movie, index) => {
        const li = document.createElement('li');

        li.textContent = movie.getInfo();
        li.style.marginBottom = "10px";
        li.style.padding = "10px 20px";
        if(index%2 === 0) {
            li.style.backgroundColor = "#D3D3D3";
        }
        //create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "❌ Delete";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.style.padding = "10px 20px";
        deleteBtn.style.backgroundColor = "transparent";
        deleteBtn.style.color = "#F44336";
        deleteBtn.style.border = "2px solid #F44336";
        deleteBtn.style.borderRadius = "4px";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.fontWeight = "bold";
        
        deleteBtn.onclick = function () {
            deleteMovie(index);
        };

        //create edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = "✏️ Edit";
        editBtn.style.marginLeft = "10px";
        editBtn.style.padding = "10px 20px";
        editBtn.style.backgroundColor = "transparent";
        editBtn.style.color = "#4CAF50";
        editBtn.style.border = "2px solid #4CAF50";
        editBtn.style.borderRadius = "8px";
        editBtn.style.cursor = "pointer";
        editBtn.style.fontWeight = "bold";

        editBtn.onclick = function() {
            editMovie(index)
        };

        
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        
        list.appendChild(li);
    });

    // for(let movie of movies) {
        

    // }
}

function deleteMovie(index)  {
    console.log("Delete val: ", index);
    movies.splice(index,1);
    localStorage.setItem("movies", JSON.stringify(movies)); //update storage
    displayMovies();
}

function editMovie(index) {
    console.log("Edit val: ", index);
}