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

import { ArticleDto } from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Article<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description test
   *
   * @tags Article
   * @name ArticleDetail
   * @request GET:/article/{articleId}
   * @secure
   */
  articleDetail = (articleId: string, params: RequestParams = {}) =>
    this.request<ArticleDto, any>({
      path: `/article/${articleId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description test
   *
   * @tags Article
   * @name ArticleUpdate
   * @request PUT:/article/{articleId}
   * @secure
   */
  articleUpdate = (articleId: string, article: ArticleDto, params: RequestParams = {}) =>
    this.request<ArticleDto, any>({
      path: `/article/${articleId}`,
      method: 'PUT',
      body: article,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description test
   *
   * @tags Article
   * @name ArticleDelete
   * @request DELETE:/article/{articleId}
   * @secure
   */
  articleDelete = (articleId: string, params: RequestParams = {}) =>
    this.request<ArticleDto, any>({
      path: `/article/${articleId}`,
      method: 'DELETE',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description test
   *
   * @tags Article
   * @name ArticlesList
   * @request GET:/articles
   * @secure
   */
  articlesList = (query?: { page?: string; size?: string }, params: RequestParams = {}) =>
    this.request<ArticleDto, any>({
      path: `/articles`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description test
   *
   * @tags Article
   * @name ArticlesDetail
   * @request GET:/articles/{userId}
   * @secure
   */
  articlesDetail = (
    userId: string,
    query?: { page?: string; size?: string },
    params: RequestParams = {},
  ) =>
    this.request<ArticleDto, any>({
      path: `/articles/${userId}`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
}
