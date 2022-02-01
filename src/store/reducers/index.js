import { combineReducers } from "redux";
import metorReducer from "./metorReducer"

const reducers = combineReducers({
    metorState: metorReducer
})

export default reducers