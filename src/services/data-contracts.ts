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

export interface LoginBody {
  id?: number;
  externalId?: number;
  loginType: string;
}

export interface UserDto {
  /** @format int64 */
  id?: number;
  loginType?: string;
  externalId?: number;
  nickname?: string;
  gender?: string;
  email?: string;
  name?: string;
  phoneNumber?: string;
  profileImage?: string;
  ageRange?: string;
  birthday?: string;
  followerCount?: number;
  followingCount?: number;
  createDate?: string;
  modifyDate?: string;
}

export interface ArticleDto {
  id?: number;
  creatorId?: number;
  creator?: UserDto;
  categoryId?: number;
  title?: string;
  viewCount?: number;
  likeCount?: number;
  tags?: string;
  contents?: string;
  isPublished?: boolean;
  createDate?: string;
  modifyDate?: string;
}

export interface FollowDto {
  id?: number;
  follower?: number;
  followee?: number;
  createDate?: string;
}

export interface ScrapDto {
  id?: number;
  userId?: number;
  articleId?: number;
}
