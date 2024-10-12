document.addEventListener('DOMContentLoaded', () => {
    const apiPeliculas = "https://japceibal.github.io/japflix_api/movies-data.json";
    let listaPeliculas = []; 

    //Petición a la API de la lista de peliculas 
    const fetchMovies = async() =>{
        try{
            const res = await fetch(apiPeliculas);
            if (!res.ok) throw new Error("Error fetch movies");
            const data = await res.json();
            listaPeliculas = data;
            console.log(listaPeliculas);
        } catch (error){
            console.error("Hubo un problema al obtener las películas:", error);
        }
    }
    fetchMovies()

    let buscarPeliculas = () => {
        let buscado = document.getElementById("inputBuscar").value.toLowerCase();
        let resultados = listaPeliculas.filter(pelicula =>{
            return  pelicula.title.toLowerCase().includes(buscado) ||
                    pelicula.genres.some(genre => genre.name.toLowerCase().includes(buscado)) ||
                    (pelicula.tagline && pelicula.tagline.toLowerCase().includes(buscado)) ||
                    (pelicula.tagline && pelicula.overview.toLowerCase().includes(buscado));
            });
        
        let lista = document.getElementById("lista");
        lista.innerHTML = "";

        if (resultados.length > 0) {
            resultados.forEach(pelicula => {
                let itemPelicula = document.createElement("li");
                itemPelicula.classList.add("list-group-item");

                let titulo = document.createElement("h3");
                titulo.textContent = pelicula.title;

                let tagline = document.createElement("p");
                tagline.textContent = pelicula.tagline;

                let estrellas = document.createElement("div");
                estrellas.innerHTML = generarEstrellas(pelicula.vote_average);

                itemPelicula.addEventListener('click', () => mostrarDetallePelicula(pelicula));

                itemPelicula.appendChild(titulo);
                itemPelicula.appendChild(tagline);
                itemPelicula.appendChild(estrellas);

                lista.appendChild(itemPelicula);
            });
        } else {
            lista.textContent = "No se encontraron películas";
        }
    }

    let generarEstrellas = (vote_average) => {
        let maxEstrellas = 5;
        let rating = (vote_average / 2); 
        let estrellasHTML = "";

        
        for (let i = 1; i <= maxEstrellas; i++) {
            if (i <= Math.floor(rating)) {
                estrellasHTML += '<i class="fa fa-star text-warning"></i>';  
            } else {
                estrellasHTML += '<i class="fa fa-star-o text-warning"></i>';  
            }
        }
        return estrellasHTML;
    }

    document.getElementById('btnBuscar').addEventListener('click', buscarPeliculas)

    let crearOffcanvas = () => {
        let offcanvas = document.createElement("div");
        offcanvas.classList.add("offcanvas", "offcanvas-top");
        offcanvas.setAttribute("tabindex", "-1");
        offcanvas.setAttribute("id", "offcanvasPelicula");
        offcanvas.setAttribute("aria-labelledby", "offcanvasPeliculaLabel");
    
        offcanvas.innerHTML = `
            <div class="offcanvas-header">
                <h5 id="offcanvasPeliculaLabel" class="offcanvas-title"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="cerrar"></button>
            </div>
            <div class="offcanvas-body">
                <p id="overviewPelicula"></p>
                <hr>
                <ul id="generosPelicula" class="list-unstyled"></ul>
                <div class="dropdown mt-3">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    More
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li><a class="dropdown-item" id="year"></a></li>
                    <li><a class="dropdown-item" id="runtime"></a></li>
                    <li><a class="dropdown-item" id="budget"></a></li>
                    <li><a class="dropdown-item" id="revenue"></a></li>
                </ul>
            </div>
            </div>
        `;
    
        document.body.appendChild(offcanvas);
    }
    crearOffcanvas();

    let mostrarDetallePelicula = (pelicula) => {
        document.getElementById("offcanvasPeliculaLabel").textContent = pelicula.title;

        document.getElementById("overviewPelicula").textContent = pelicula.overview;

        let generosPelicula = document.getElementById("generosPelicula");
        generosPelicula.innerHTML = ""; 

        pelicula.genres.forEach(genre => {
            let li = document.createElement("li");
            li.textContent = genre.name; 
            generosPelicula.appendChild(li);
        });

        document.getElementById("year").textContent = `Year: ${pelicula.release_date.split('-')[0]}`;
        document.getElementById("runtime").textContent = `Runtime: ${pelicula.runtime} minutos`;
        document.getElementById("budget").textContent = `Budget: $${pelicula.budget.toLocaleString()}`;
        document.getElementById("revenue").textContent = `Revenue: $${pelicula.revenue.toLocaleString()}`;

        let offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasPelicula'));
        offcanvas.show();
    }
});
