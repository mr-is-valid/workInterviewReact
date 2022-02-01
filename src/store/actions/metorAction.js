export const setMetorListState = (amount) => {
    return (dispatch) => {
        dispatch({
            type: "setMetorListState",
            payload: amount
        });
    }
}

export const getMetorListState = (data) => {
    console.log("Lol");
    return (dispatch) => {
        dispatch({
            type: "getMetorListState",
            payload: data
        });
    }
}