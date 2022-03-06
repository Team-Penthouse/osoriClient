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

export interface UserDto {
  id?: number;
  loginType: 'NONE' | 'KAKAO' | 'GOOGLE' | 'APPLE';
  externalId?: number;
  nickname: string;
  gender?: string;
  email?: string;
  name?: string;
  phoneNumber?: string;
  profileImg?: string;
  ageRange?: string;
  birthday?: string;

  /** @format date */
  createDate?: string;

  /** @format date */
  modifyDate?: string;
}

export interface ArticleDto {
  id?: number;
  creatorId: number;
  categoryId?: number;
  title: string;
  viewCount?: number;
  likeCount?: number;
  tags?: string;
  contents: string;
  isPublished?: boolean;

  /** @format date */
  createDate?: string;

  /** @format date */
  modifyDate?: string;
}
