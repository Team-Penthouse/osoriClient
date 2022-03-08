/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { HttpClient, RequestParams } from './http-client';
import { ArticleDto } from './data-contracts';

export class Articles<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Articles
   * @name ArticlesList
   * @request GET:/articles
   */
  articlesList = (params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/articles`,
      method: 'GET',
      query: params,
      ...params,
    });
  /**
   * No description
   *
   * @tags Articles
   * @name ArticleCreate
   * @request POST:/article
   */
  articleCreate = (data: ArticleDto, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/article`,
      method: 'POST',
      body: data,
      ...params,
    });
  /**
   * No description
   *
   * @tags Articles
   * @name ArticleDetail
   * @request GET:/article/{articleId}
   */
  articleDetail = (articleId: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/article/${articleId}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Articles
   * @name UpdateArticles
   * @request UPDATE:/article/{articleId}
   */
  updateArticles = (articleId: string, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/article/${articleId}`,
      method: 'UPDATE',
      ...params,
    });
  /**
   * No description
   *
   * @tags Articles
   * @name ArticleDelete
   * @request DELETE:/article/{articleId}
   */
  articleDelete = (articleId: number, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/article/${articleId}`,
      method: 'DELETE',
      ...params,
    });
}
