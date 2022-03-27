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

import { ArticleDto, UserDto } from './data-contracts';
import { HttpClient, RequestParams } from './http-client';

export class Follow<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description test
   *
   * @tags Follow
   * @name FollowCreate
   * @request POST:/follow/{userId}
   * @secure
   */
  followCreate = (userId: string, params: RequestParams = {}) =>
    this.request<ArticleDto, any>({
      path: `/follow/${userId}`,
      method: 'POST',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description test
   *
   * @tags Follow
   * @name FollowDelete
   * @request DELETE:/follow/{userId}
   * @secure
   */
  followDelete = (userId: string, params: RequestParams = {}) =>
    this.request<ArticleDto, any>({
      path: `/follow/${userId}`,
      method: 'DELETE',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description test
   *
   * @tags Follow
   * @name FollowerDetail
   * @request GET:/follow/follower/{userId}
   * @secure
   */
  followerDetail = (
    userId: string,
    query?: { page?: string; size?: string },
    params: RequestParams = {},
  ) =>
    this.request<UserDto, any>({
      path: `/follow/follower/${userId}`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description test
   *
   * @tags Follow
   * @name FollowingDetail
   * @request GET:/follow/following/{userId}
   * @secure
   */
  followingDetail = (
    userId: string,
    query?: { page?: string; size?: string },
    params: RequestParams = {},
  ) =>
    this.request<UserDto, any>({
      path: `/follow/following/${userId}`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
}
