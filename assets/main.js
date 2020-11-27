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
        maxStars: 5, // maximum rate vote
        inputClass: "", // css classes for input
        searchText: "", // search-bar input
        searchMsg: "", // user's search for display
        isLoading: false, // boolean for loading
        activeFilm: -1, // film with user-focus
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
                        this.films = this.films.concat(answer.data.results);

                        // set the DOM
                        this.isLoading = false; // END the loading-render
                    })
                ;

                axios // axios request --> tv series
                    .get(apiUrl + "search/tv", currentPar)
                    .then( (answer) => {
                        this.films = this.films.concat(answer.data.results);

                        // set the DOM
                        this.isLoading = false; // END the loading-render
                    })
                ;
            } // END if: get films
        },
        setCardBgr: function(backdropPath) {
            // backdropPath --> final part of url backdrop-poster

            if (backdropPath != null) {
                // it's not null --> assembly url and return it

                // local var
                let thisBgrImg; // this background style (url or white)

                thisBgrImg = "background-image: url(\"" + posterUrl + posterSize + backdropPath + "\";";

                return thisBgrImg;
            }
        },
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
        },
        isFilm: function(filmIndex) {
            // return true if it's film, false if it's a serie

            // local var
            let thisType = app.films[filmIndex].media_type; // this media-type

            return thisType == "movie";
        },
        setStars: function(filmVote) {
            // filmVote: from 1 to 10
            let numberOfStars; // number of stars --> TO RETURN

            // new-vote function: from 0 to 5
            return numberOfStars = Math.ceil(filmVote * this.maxStars / 10);
        },
        toggleSearchBar: function() {
            if (!this.inputClass) {
                // if current class == "" --> add "visible"
                this.inputClass = "search-on";

                // focus the input
                this.$refs.searchInput.focus();
            } else {
                this.inputClass = "";
            }
        },
    },
    mounted: function() {

    },
});
