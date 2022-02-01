const initialState = {
    metorList: [],
    mapToken: "pk.eyJ1IjoibXJpc3ZhbGlkIiwiYSI6ImNrZXY3bXFtcjB4MjMycXA3a3Znc3RkaHIifQ.Fa6Crua7ws6ssDYg56E12w",
    baseUrl: "https://data.nasa.gov/resource/y77d-th95.json"
};

const metorReducer = (state = initialState,action) => {
    switch (action.type) {
        case "setMetorListState":
            return state.metorList = [...action.payload];
        case "getMetorListState":
                return state;
        default:
            return state;
    }
}

export default metorReducer;