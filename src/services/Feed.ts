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

export class Feed<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description test
   *
   * @tags Feed
   * @name FeedsList
   * @request GET:/feeds
   * @secure
   */
  feedsList = (query?: { page?: string; size?: string }, params: RequestParams = {}) =>
    this.request<ArticleDto[], any>({
      path: `/feeds`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
}
