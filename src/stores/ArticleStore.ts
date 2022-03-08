import { Articles } from '../services/Articles';
import { ArticleDto } from '../services/data-contracts';

export default class ArticleStore {
  api: Articles;

  constructor() {
    this.api = new Articles();
  }

  article?: ArticleDto;

  setArticle = (article: ArticleDto) => {
    this.article = article;
  };
}
