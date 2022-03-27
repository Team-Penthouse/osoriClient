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
import { HttpClient, RequestParams } from './http-client';

export class Scrap<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description test
   *
   * @tags Scrap
   * @name ScrapCreate
   * @request POST:/scrap/{articleId}
   * @secure
   */
  scrapCreate = (articleId: string, params: RequestParams = {}) =>
    this.request<ArticleDto, any>({
      path: `/scrap/${articleId}`,
      method: 'POST',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description test
   *
   * @tags Scrap
   * @name ScrapDelete
   * @request DELETE:/scrap/{articleId}
   * @secure
   */
  scrapDelete = (articleId: string, params: RequestParams = {}) =>
    this.request<ArticleDto, any>({
      path: `/scrap/${articleId}`,
      method: 'DELETE',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description test
   *
   * @tags Scrap
   * @name ScrapsDetail
   * @request GET:/scraps/{userId}
   * @secure
   */
  scrapsDetail = (userId: string, params: RequestParams = {}) =>
    this.request<ArticleDto, any>({
      path: `/scraps/${userId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
}
