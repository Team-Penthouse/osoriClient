import { combineReducers } from 'redux';
import { uiReducer } from './uiStore';
import authReducer from './authStore';
import userReducer from './userStore';
import articleReducer from './articleReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    ui: uiReducer,
    user: userReducer,
    article: articleReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
