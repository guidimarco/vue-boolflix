// API VAR
const myApiKey = "f14b811e77f424ab83b5ac2e25d349b8"; // my api key
const apiUrl = "https://api.themoviedb.org/3/"; // api url for films and series
const posterUrl = "https://image.tmdb.org/t/p/"; // api url for posters and backdrop
const posterSize = "w300"; // backdrop size (width 300px)

var app = new Vue({ // VUE INSTANCE
    el: "#root",
    data: {
        myFlags: "de en es fr it ja pt", // all my flags
        altFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/No_flag.svg/1280px-No_flag.svg.png", // alternative flag
        altBgr: "https://www.ancebiella.it/wp-content/uploads/2016/01/img-not-found-395x256.jpg", // alternative background img (for path-null-film and 404 error)
        maxStars: 5, // maximum rate vote
        inputClass: "", // css classes for input
        searchText: "", // search-bar input
        searchMsg: "", // user's search for display
        isLoading: false, // boolean for loading
        typeFilter: ["movie", "tv"], // filter for type --> default all selected
        films: [],
        Genres: [], // all genre
    },
    methods: {
        // API function
        getGenres: function() {
            // set axios paramas
            let genrePar = {
                params: {
                    api_key: myApiKey,
                    language: "it",
                }
            } // current search parameters

            // search movie genres
            let finalUrl = "genre/movie/list";
            axios
                .get(apiUrl + finalUrl, genrePar)
                .then( (answer) => {
                    if (!this.Genres.length) {
                        // genres array empty
                        this.Genres = answer.data.genres;
                    } else {
                        // it's not empty --> i have to filter

                        // get all id
                        let currentGenres = [];
                        this.Genres.forEach( (genre) => {
                            currentGenres.push(genre.id);
                        });

                        // filter new data
                        let newGenres = answer.data.genres.filter( () => {
                            !currentGenres.includes(answer.data.genres.id)
                        });

                        this.Genres = this.Genres.concat(newGenres);
                    }
                })
            ;

            // new search: tv serie genres
            finalUrl = "genre/tv/list";
            axios
                .get(apiUrl + finalUrl, genrePar)
                .then( (answer) => {
                    if (!this.Genres.length) {
                        // genres array empty
                        this.Genres = answer.data.genres;
                    } else {
                        // it's not empty --> i have to filter

                        // get all id
                        let currentGenres = [];
                        this.Genres.forEach( (genre) => {
                            currentGenres.push(genre.id);
                        });

                        // filter new data
                        let newGenres = answer.data.genres.filter( (value) => {
                            return !currentGenres.includes(value.id);
                        });

                        this.Genres = this.Genres.concat(newGenres);
                    }
                })
            ;
        }, // API get all genres (film and serie)
        getFilms: function() {
            // local VAR
            let thisSearch = this.searchText.trim(); // user's search
            // reset the search
            this.searchText = "";

            // check: get api only if thisSearch != 0
            if (thisSearch) {
                // local VAR
                let currentPar = {
                    params: {
                        api_key: myApiKey,
                        query: thisSearch, // user's search --> see data
                        language: "it",
                    }
                } // current search parameters

                // set the data
                this.films = [];

                // set the DOM
                this.isLoading = true; // START the loading-render
                this.searchMsg = thisSearch; // change the msg
                this.toggleSearchBar(); // close the search bar

                axios // axios request --> films
                    .get(apiUrl + "search/movie", currentPar)
                    .then( (answer) => {
                        let apiFilms = answer.data.results;

                        this.addMovieCasts(apiFilms); // get the cast (with api) and add a new property

                        this.films = this.films.concat(apiFilms);

                        // set the DOM
                        this.isLoading = false; // END the loading-render
                    })
                ;

                axios // axios request --> tv series
                    .get(apiUrl + "search/tv", currentPar)
                    .then( (answer) => {
                        let apiSeries = answer.data.results;

                        this.addSerieCasts(apiSeries); // get the cast (with api) and add a new property

                        this.films = this.films.concat(apiSeries);

                        // set the DOM
                        this.isLoading = false; // END the loading-render
                    })
                ;
            } // END if: get films
        }, // API get film and serie tv
        addMovieCasts: function(filmsArray) {
            // set axios paramas
            let castPar = {
                params: {
                    api_key: myApiKey,
                    language: "it",
                }
            } // current search parameters

            // for each film in films
            filmsArray.forEach( (film) => {
                // current id and url
                let currentId = film.id;
                let finalUrl = "movie/" + currentId + "/credits";

                // ask axios for credits
                axios
                    .get(apiUrl + finalUrl, castPar)
                    .then( (answer) => {
                        Vue.set(film, 'cast', answer.data.cast);
                        Vue.set(film, 'media_type', "movie");
                    })
                ;
            });
        }, // API get movie cast, add to film-obj and add media type
        addSerieCasts: function(tvSerieArray) {
            // set axios paramas
            let castPar = {
                params: {
                    api_key: myApiKey,
                    language: "it",
                }
            } // current search parameters

            // for each film in films
            tvSerieArray.forEach( (serie) => {
                // current id and url
                let currentId = serie.id;
                let finalUrl = "tv/" + currentId + "/credits";

                // ask axios for credits
                axios
                    .get(apiUrl + finalUrl, castPar)
                    .then( (answer) => {
                        Vue.set(serie, 'cast', answer.data.cast);
                        Vue.set(serie, 'media_type', "tv");
                    })
                ;
            });
        },  // API get movie cast, add to film-obj and add media type

        // CARD function
        setCardBgr: function(backdropPath) {
            // set the bgr card

            if (backdropPath === null) {
                // it's null --> alt background
                return this.setAltBgr();
            } else {
                // it's not null --> poster bgr
                return "background-image: url(\"" + posterUrl + posterSize + backdropPath + "\";";
            }
        }, // set card background
        setAltBgr: function() {
            return "background-image: url(\"" + this.altBgr + "\";";
        }, // return alternative background (see data)
        setFlag: function(filmFlag) {
            // filmFlag --> current film language (same as flag)
            let flagUrl; // final flag src --> TO RETURN

            if (this.myFlags.includes(filmFlag)) {
                // set local src
                flagUrl = "assets/flags/" + filmFlag + ".png";
            } else {
                // set alternative url
                flagUrl = this.altFlag;
            }

            return flagUrl;
        }, // set language flag
        setStars: function(filmVote) {
            // filmVote: from 1 to 10
            let numberOfStars; // number of stars --> TO RETURN

            // new-vote function: from 0 to 5
            return numberOfStars = Math.ceil(filmVote * this.maxStars / 10);
        }, // set vote stars
        stampCast: function(filmCast) {
            let thisCast = [];

            filmCast.slice(0,5).forEach( (actor) => {
                thisCast.push(actor.name);
            });

            return thisCast.join(", ");
        }, // stamp in the dom
        stampGenres: function(genresArray) {
            // local var
            let thisGenres = [];

            // check every film-genre
            for (var i = 0; i < genresArray.length; i++) {
                let currentIdGenre = genresArray[i];

                // find the genre with same id
                this.Genres.forEach( (genre) => {
                    if (genre.id == currentIdGenre) {
                        thisGenres.push(genre.name);
                    }
                });
            }

            return thisGenres.join(", ");
        }, // CHECK stamp genre in card

        // SEARCH BAR function
        toggleSearchBar: function() {
            if (!this.inputClass) {
                // if current class == "" --> add "visible"
                this.inputClass = "search-on";

                // focus the input
                this.$refs.searchInput.focus();
            } else {
                this.inputClass = "";
            }
        }, // toggle class "search-on"

        // SEARCH FILTER
        changeTypeFilter: function(type) {
            if (this.typeFilter.includes(type)) {
                this.typeFilter = this.typeFilter.filter( (value) => {
                    return value != type;
                });
            } else {
                this.typeFilter.push(type);
            }
        }, // filter for media type
    },
    mounted: function() {
        this.getGenres();
    },
    watch: {

    }
});
