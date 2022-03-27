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

import { ArticleDto, LoginBody, UserDto } from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class User<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description test
   *
   * @tags User
   * @name UserDetail
   * @request GET:/user/{userId}
   * @secure
   */
  userDetail = (userId: string, params: RequestParams = {}) =>
    this.request<UserDto, any>({
      path: `/user/${userId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description test
   *
   * @tags User
   * @name UserUpdate
   * @request PUT:/user/{userId}
   * @secure
   */
  userUpdate = (userId: string, user: UserDto, params: RequestParams = {}) =>
    this.request<UserDto, any>({
      path: `/user/${userId}`,
      method: 'PUT',
      body: user,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description test
   *
   * @tags User
   * @name UserDelete
   * @request DELETE:/user/{userId}
   * @secure
   */
  userDelete = (userId: string, params: RequestParams = {}) =>
    this.request<ArticleDto, any>({
      path: `/user/${userId}`,
      method: 'DELETE',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description test
   *
   * @tags User
   * @name UsersList
   * @request GET:/users
   * @secure
   */
  usersList = (params: RequestParams = {}) =>
    this.request<UserDto[], any>({
      path: `/users`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description test
   *
   * @tags User
   * @name UserCreate
   * @request POST:/user
   * @secure
   */
  userCreate = (user: UserDto, params: RequestParams = {}) =>
    this.request<UserDto, any>({
      path: `/user`,
      method: 'POST',
      body: user,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description test
   *
   * @tags User
   * @name LoginCreate
   * @request POST:/user/login
   * @secure
   */
  loginCreate = (user: LoginBody, params: RequestParams = {}) =>
    this.request<UserDto, any>({
      path: `/user/login`,
      method: 'POST',
      body: user,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
