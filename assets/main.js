// API VAR
const myApiKey = "f14b811e77f424ab83b5ac2e25d349b8"; // my api key
const filmApiUrl = "https://api.themoviedb.org/3/"; // api url for films and series
const posterUrl = "https://image.tmdb.org/t/p/"; // api url for posters and backdrop
const posterSize = "w300"; // backdrop size (width 300px)

var app = new Vue({ // VUE INSTANCE
    el: "#root",
    data: {
        searchText: "",
        searchMsg: "",
        isLoading: false,
        films: [],
    },
    methods: {
        getFilms: function() {
            // local VAR
            let thisSearch = this.searchText.trim(); // user's search
            // reset the search
            this.searchText = "";

            // check: get api only if thisSearch != 0
            if (thisSearch) {
                // local VAR
                let currentList; // list of films from server
                this.isLoading = true; // START the loading-render
                this.searchMsg = thisSearch; // change the msg

                // axios request --> films and tv series
                axios
                    .get(filmApiUrl + "search/multi", { params: {
                            api_key: myApiKey,
                            query: thisSearch, // user's search --> see data
                            language: "it",
                        }
                    }).then( (filmsResults) => {
                        currentList = filmsResults.data.results;

                        // filter the results: discard the person
                        currentList = currentList.filter( (item) => {
                            return item.media_type != "person";
                        });

                        this.films = currentList; // push the list into the data
                        this.isLoading = false; // END the loading-render
                    })
                ;
            } // END if: get films
        },
        getBgrPath: function(filmIndex) {
            // local var
            let thisPath = app.films[filmIndex].backdrop_path; // this backdrop-path
            let thisBgrPath; // url of the poster

            // assembly url and return it
            return thisBgrPath = "background-image: url(" + posterUrl + posterSize + thisPath + ";";
        },
        nStars: function(filmIndex) {
            // local var
            let thisVote = app.films[filmIndex].vote_average; // old vote 0-10
            let nStars; // number of stars

            // new-vote function: from 0 to 5
            return nStars = Math.round(thisVote / 2);
        },
        setAltFlag: function(event) {
            let altFlagSrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/No_flag.svg/1280px-No_flag.svg.png";

            event.target.src = altFlagSrc;
        },
    },
    mounted: function() {

    },
});
