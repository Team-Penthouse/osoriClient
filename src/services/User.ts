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

export class User<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags User
   * @name UsersList
   * @request GET:/users
   */
  usersList = (params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/users`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags User
   * @name UserCreate
   * @request POST:/user
   */
  userCreate = (data: { nickname?: string; loginType?: string }, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/user`,
      method: 'POST',
      body: data,
      ...params,
    });
  /**
   * No description
   *
   * @tags User
   * @name UserDetail
   * @request GET:/user/{userId}
   */
  userDetail = (userId: number, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/user/${userId}`,
      query: params,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags User
   * @name UpdateUser
   * @request UPDATE:/user/{userId}
   */
  updateUser = (userId: string, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/user/${userId}`,
      method: 'UPDATE',
      ...params,
    });
  /**
   * No description
   *
   * @tags User
   * @name UserDelete
   * @request DELETE:/user/{userId}
   */
  userDelete = (userId: number, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/user/${userId}`,
      method: 'DELETE',
      ...params,
    });
}
