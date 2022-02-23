import { TemporaryArticleType } from '../types/TemporaryTypes';

const SET_CURRENT_ARTICLE = 'article/SET_CURRENT_ARTICLE';

export const setCurrentArticle = (article: TemporaryArticleType) => ({ type: SET_CURRENT_ARTICLE, payload: article });

interface ArticleReducer {
    currentArticle: TemporaryArticleType | undefined;
}

const initialState: ArticleReducer = {
  currentArticle: undefined,
};

const articleReducer = (state = initialState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case SET_CURRENT_ARTICLE:
      return {
        ...state,
        currentArticle: action.payload,
      };
    default:
      return state;
  }
};

export default articleReducer;
