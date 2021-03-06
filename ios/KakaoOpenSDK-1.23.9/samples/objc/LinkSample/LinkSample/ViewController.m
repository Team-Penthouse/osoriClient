/**
 * Copyright 2015-2018 Kakao Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#import <KakaoLink/KakaoLink.h>
#import <KakaoMessageTemplate/KakaoMessageTemplate.h>

#import "ViewController.h"
#import "IconTableViewCell.h"
#import "StoryLinkHelper.h"
#import "UIAlertController+Addition.h"
#import "ConfigConstants.h"

@interface ViewController () <UITableViewDelegate, UITableViewDataSource, UIDocumentInteractionControllerDelegate, UIImagePickerControllerDelegate, UINavigationControllerDelegate>

@property (weak, nonatomic) IBOutlet UITableView *tableView;

@end

@implementation ViewController {
    NSArray *_menuItems;
    UIDocumentInteractionController *_documentController;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
    self.tableView.tableFooterView = [[UIView alloc] init];
    self.tableView.delegate = self;
    self.tableView.dataSource = self;
    
    _menuItems = @[@[@"KakaoLink", @[@[@"Send Default", @"(Feed Template)", @"SendFeed"],
                                     @[@"Send Defalut", @"(List Template)", @"SendList"],
                                     @[@"Send Defalut", @"(Location Template)", @"SendLocation"],
                                     @[@"Send Default", @"(Commerce Template)", @"SendCommerce"],
                                     @[@"Send Scrap", @"", @"SendScrap"],
                                     @[@"Send Custom", @"", @"SendCustom"],
                                     ]
                     ],
                   @[@"Image Storage", @[@[@"Upload Image", @"", @"Upload"],
                                         @[@"Scrap Image", @"", @"Upload"],
                                         ]
                     ],
                   @[@"Etc", @[@[@"Story Posting", @"", @"StoryPosting"],
                               @[@"Share File", @"(UIDocumentInteractionController)", @"ShareFile"],
                               ]
                     ]
                ];
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    return 60;
}


- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return _menuItems.count;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [_menuItems[section][1] count];
}

- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section {
    return _menuItems[section][0];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"IconTableViewCell"];
    if (cell == nil) {
        cell = [[IconTableViewCell alloc] initWithStyle:UITableViewCellStyleSubtitle reuseIdentifier:@"IconTableViewCell"];
    }
    
    NSArray *menuItem = _menuItems[indexPath.section][1][indexPath.row];
    cell.textLabel.text = menuItem[0];
    cell.detailTextLabel.text = menuItem[1];
    cell.imageView.image = [UIImage imageNamed:menuItem[2]];
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    
    switch (indexPath.section) {
        case 0:
            switch (indexPath.row) {
                case 0:
                    [self sendLinkFeed];
                    break;
                case 1:
                    [self sendLinkList];
                    break;
                case 2:
                    [self sendLinkLocation];
                    break;
                case 3:
                    [self sendLinkCommerce];
                    break;
                case 4:
                    [self sendLinkScrap];
                    break;
                case 5:
                    [self sendLinkCustom];
                    break;
                default:
                    break;
            }
            break;
        case 1:
            switch (indexPath.row) {
                case 0:
                    [self uploadLocalImage];
                    break;
                case 1:
                    [self scrapRemoteImage];
                    break;
            }
            break;
        case 2:
            switch (indexPath.row) {
                case 0:
                    [self postStory];
                    break;
                case 1:
                    [self showChooseSharingFile];
                    break;
            }
            break;
    }
}

- (void)sendLinkFeed {
    
    // Feed ?????? ????????? ???????????? ??????
    KMTTemplate *template = [KMTFeedTemplate feedTemplateWithBuilderBlock:^(KMTFeedTemplateBuilder * _Nonnull feedTemplateBuilder) {

        // ?????????
        feedTemplateBuilder.content = [KMTContentObject contentObjectWithBuilderBlock:^(KMTContentBuilder * _Nonnull contentBuilder) {
            contentBuilder.title = @"?????? ?????? ??????";
            contentBuilder.desc = @"#?????? #?????? #????????? #?????? #????????? #?????????";
            contentBuilder.imageURL = [NSURL URLWithString:@"http://mud-kage.kakao.co.kr/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png"];
            contentBuilder.link = [KMTLinkObject linkObjectWithBuilderBlock:^(KMTLinkBuilder * _Nonnull linkBuilder) {
                linkBuilder.mobileWebURL = [NSURL URLWithString:@"https://developers.kakao.com"];
            }];
        }];

        // ??????
        feedTemplateBuilder.social = [KMTSocialObject socialObjectWithBuilderBlock:^(KMTSocialBuilder * _Nonnull socialBuilder) {
            socialBuilder.likeCount = @(286);
            socialBuilder.commnentCount = @(45);
            socialBuilder.sharedCount = @(845);
        }];

        // ??????
        [feedTemplateBuilder addButton:[KMTButtonObject buttonObjectWithBuilderBlock:^(KMTButtonBuilder * _Nonnull buttonBuilder) {
            buttonBuilder.title = @"????????? ??????";
            buttonBuilder.link = [KMTLinkObject linkObjectWithBuilderBlock:^(KMTLinkBuilder * _Nonnull linkBuilder) {
                linkBuilder.mobileWebURL = [NSURL URLWithString:@"https://developers.kakao.com"];
            }];
        }]];
        [feedTemplateBuilder addButton:[KMTButtonObject buttonObjectWithBuilderBlock:^(KMTButtonBuilder * _Nonnull buttonBuilder) {
            buttonBuilder.title = @"????????? ??????";
            buttonBuilder.link = [KMTLinkObject linkObjectWithBuilderBlock:^(KMTLinkBuilder * _Nonnull linkBuilder) {
                linkBuilder.iosExecutionParams = @"param1=value1&param2=value2";
                linkBuilder.androidExecutionParams = @"param1=value1&param2=value2";
            }];
        }]];
    }];
    
    // ???????????? ???????????? ?????? ??????
    NSDictionary *serverCallbackArgs = @{@"user_id": @"abcd",
                                         @"product_id": @"1234"};
    
    // ??????????????? ??????
    [[KLKTalkLinkCenter sharedCenter] sendDefaultWithTemplate:template serverCallbackArgs:serverCallbackArgs success:^(NSDictionary<NSString *,NSString *> * _Nullable warningMsg, NSDictionary<NSString *,NSString *> * _Nullable argumentMsg) {
        
        // ??????
        NSLog(@"warning message: %@", warningMsg);
        NSLog(@"argument message: %@", argumentMsg);
        
    } failure:^(NSError * _Nonnull error) {
        
        // ??????
        [UIAlertController showMessage:error.description];
        NSLog(@"error: %@", error);
        
    }];
}

- (void)sendLinkList {
    
    // List ?????? ????????? ???????????? ??????
    KMTTemplate *template = [KMTListTemplate listTemplateWithBuilderBlock:^(KMTListTemplateBuilder * _Nonnull listTemplateBuilder) {

        // ?????? ????????? ??? ??????
        listTemplateBuilder.headerTitle = @"WEEKLY MAGAZINE";
        listTemplateBuilder.headerLink = [KMTLinkObject linkObjectWithBuilderBlock:^(KMTLinkBuilder * _Nonnull linkBuilder) {
            linkBuilder.mobileWebURL = [NSURL URLWithString:@"https://developers.kakao.com"];
        }];

        // ????????? ??????
        [listTemplateBuilder addContent:[KMTContentObject contentObjectWithBuilderBlock:^(KMTContentBuilder * _Nonnull contentBuilder) {
            contentBuilder.title = @"????????? ??????, ??????";
            contentBuilder.desc = @"?????????";
            contentBuilder.imageURL = [NSURL URLWithString:@"http://mud-kage.kakao.co.kr/dn/bDPMIb/btqgeoTRQvd/49BuF1gNo6UXkdbKecx600/kakaolink40_original.png"];
            contentBuilder.link = [KMTLinkObject linkObjectWithBuilderBlock:^(KMTLinkBuilder * _Nonnull linkBuilder) {
                linkBuilder.mobileWebURL = [NSURL URLWithString:@"https://developers.kakao.com"];
            }];
        }]];
        [listTemplateBuilder addContent:[KMTContentObject contentObjectWithBuilderBlock:^(KMTContentBuilder * _Nonnull contentBuilder) {
            contentBuilder.title = @"???????????? ???????????? ???????????????";
            contentBuilder.desc = @"??????";
            contentBuilder.imageURL = [NSURL URLWithString:@"http://mud-kage.kakao.co.kr/dn/QPeNt/btqgeSfSsCR/0QJIRuWTtkg4cYc57n8H80/kakaolink40_original.png"];
            contentBuilder.link = [KMTLinkObject linkObjectWithBuilderBlock:^(KMTLinkBuilder * _Nonnull linkBuilder) {
                linkBuilder.mobileWebURL = [NSURL URLWithString:@"https://developers.kakao.com"];
            }];
        }]];
        [listTemplateBuilder addContent:[KMTContentObject contentObjectWithBuilderBlock:^(KMTContentBuilder * _Nonnull contentBuilder) {
            contentBuilder.title = @"????????? ????????? ?????????";
            contentBuilder.desc = @"??????";
            contentBuilder.imageURL = [NSURL URLWithString:@"http://mud-kage.kakao.co.kr/dn/c7MBX4/btqgeRgWhBy/ZMLnndJFAqyUAnqu4sQHS0/kakaolink40_original.png"];
            contentBuilder.link = [KMTLinkObject linkObjectWithBuilderBlock:^(KMTLinkBuilder * _Nonnull linkBuilder) {
                linkBuilder.mobileWebURL = [NSURL URLWithString:@"https://developers.kakao.com"];
            }];
        }]];

        // ??????
        [listTemplateBuilder addButton:[KMTButtonObject buttonObjectWithBuilderBlock:^(KMTButtonBuilder * _Nonnull buttonBuilder) {
            buttonBuilder.title = @"????????? ??????";
            buttonBuilder.link = [KMTLinkObject linkObjectWithBuilderBlock:^(KMTLinkBuilder * _Nonnull linkBuilder) {
                linkBuilder.mobileWebURL = [NSURL URLWithString:@"https://developers.kakao.com"];
            }];
        }]];
        [listTemplateBuilder addButton:[KMTButtonObject buttonObjectWithBuilderBlock:^(KMTButtonBuilder * _Nonnull buttonBuilder) {
            buttonBuilder.title = @"????????? ??????";
            buttonBuilder.link = [KMTLinkObject linkObjectWithBuilderBlock:^(KMTLinkBuilder * _Nonnull linkBuilder) {
                linkBuilder.iosExecutionParams = @"param1=value1&param2=value2";
                linkBuilder.androidExecutionParams = @"param1=value1&param2=value2";
            }];
        }]];

    }];
    
    // ???????????? ???????????? ?????? ??????
    NSDictionary *serverCallbackArgs = @{@"user_id": @"abcd",
                                         @"product_id": @"1234"};
    
    // ??????????????? ??????
    [[KLKTalkLinkCenter sharedCenter] sendDefaultWithTemplate:template serverCallbackArgs:serverCallbackArgs success:^(NSDictionary<NSString *,NSString *> * _Nullable warningMsg, NSDictionary<NSString *,NSString *> * _Nullable argumentMsg) {

        // ??????
        NSLog(@"warning message: %@", warningMsg);
        NSLog(@"argument message: %@", argumentMsg);

    } failure:^(NSError * _Nonnull error) {

        // ??????
        [UIAlertController showMessage:error.description];
        NSLog(@"error: %@", error);

    }];
}

- (void)sendLinkLocation {
    
    // Location ?????? ????????? ???????????? ??????
    KMTTemplate *template = [KMTLocationTemplate locationTemplateWithBuilderBlock:^(KMTLocationTemplateBuilder * _Nonnull locationTemplateBuilder) {

        // ??????
        locationTemplateBuilder.address = @"?????? ????????? ????????? ???????????? 235 ?????????????????? N??? 8???";
        locationTemplateBuilder.addressTitle = @"????????? ??????????????? ?????????";

        // ?????????
        locationTemplateBuilder.content = [KMTContentObject contentObjectWithBuilderBlock:^(KMTContentBuilder * _Nonnull contentBuilder) {
            contentBuilder.title = @"????????? ???????????? ?????????????????????";
            contentBuilder.desc = @"?????? ?????? ????????????????????? 1+1";
            contentBuilder.imageURL = [NSURL URLWithString:@"http://mud-kage.kakao.co.kr/dn/bSbH9w/btqgegaEDfW/vD9KKV0hEintg6bZT4v4WK/kakaolink40_original.png"];
            contentBuilder.link = [KMTLinkObject linkObjectWithBuilderBlock:^(KMTLinkBuilder * _Nonnull linkBuilder) {
                linkBuilder.mobileWebURL = [NSURL URLWithString:@"https://developers.kakao.com"];
            }];
        }];

        // ??????
        locationTemplateBuilder.social = [KMTSocialObject socialObjectWithBuilderBlock:^(KMTSocialBuilder * _Nonnull socialBuilder) {
            socialBuilder.likeCount = @(286);
            socialBuilder.commnentCount = @(45);
            socialBuilder.sharedCount = @(845);
        }];
    }];
    
    // ???????????? ???????????? ?????? ??????
    NSDictionary *serverCallbackArgs = @{@"user_id": @"abcd",
                                         @"product_id": @"1234"};
    
    // ??????????????? ??????
    [[KLKTalkLinkCenter sharedCenter] sendDefaultWithTemplate:template serverCallbackArgs:serverCallbackArgs success:^(NSDictionary<NSString *,NSString *> * _Nullable warningMsg, NSDictionary<NSString *,NSString *> * _Nullable argumentMsg) {

        // ??????
        NSLog(@"warning message: %@", warningMsg);
        NSLog(@"argument message: %@", argumentMsg);

    } failure:^(NSError * _Nonnull error) {

        // ??????
        [UIAlertController showMessage:error.description];
        NSLog(@"error: %@", error);

    }];
}

- (void)sendLinkCommerce {
    
    // Commerce ?????? ????????? ???????????? ??????
    KMTTemplate *template = [KMTCommerceTemplate commerceTemplateWithBuilderBlock:^(KMTCommerceTemplateBuilder * _Nonnull commerceTemplateBuilder) {

        // ?????????
        commerceTemplateBuilder.content = [KMTContentObject contentObjectWithBuilderBlock:^(KMTContentBuilder * _Nonnull contentBuilder) {
            contentBuilder.title = @"Ivory long dress (4 Color)";
            contentBuilder.imageURL = [NSURL URLWithString:@"http://mud-kage.kakao.co.kr/dn/RY8ZN/btqgOGzITp3/uCM1x2xu7GNfr7NS9QvEs0/kakaolink40_original.png"];
            contentBuilder.link = [KMTLinkObject linkObjectWithBuilderBlock:^(KMTLinkBuilder * _Nonnull linkBuilder) {
                linkBuilder.mobileWebURL = [NSURL URLWithString:@"https://developers.kakao.com"];
            }];
        }];

        // ??????
        commerceTemplateBuilder.commerce = [KMTCommerceObject commerceObjectWithBuilderBlock:^(KMTCommerceBuilder * _Nonnull commerceBuilder) {
            commerceBuilder.regularPrice = @(208800);
            commerceBuilder.discountPrice = @(146160);
            commerceBuilder.discountRate = @(30);
        }];

        // ??????
        [commerceTemplateBuilder addButton:[KMTButtonObject buttonObjectWithBuilderBlock:^(KMTButtonBuilder * _Nonnull buttonBuilder) {
            buttonBuilder.title = @"????????????";
            buttonBuilder.link = [KMTLinkObject linkObjectWithBuilderBlock:^(KMTLinkBuilder * _Nonnull linkBuilder) {
                linkBuilder.mobileWebURL = [NSURL URLWithString:@"https://developers.kakao.com"];
            }];
        }]];
        [commerceTemplateBuilder addButton:[KMTButtonObject buttonObjectWithBuilderBlock:^(KMTButtonBuilder * _Nonnull buttonBuilder) {
            buttonBuilder.title = @"????????????";
            buttonBuilder.link = [KMTLinkObject linkObjectWithBuilderBlock:^(KMTLinkBuilder * _Nonnull linkBuilder) {
                linkBuilder.iosExecutionParams = @"param1=value1&param2=value2";
                linkBuilder.androidExecutionParams = @"param1=value1&param2=value2";
            }];
        }]];

    }];
    
    // ???????????? ???????????? ?????? ??????
    NSDictionary *serverCallbackArgs = @{@"user_id": @"abcd",
                                         @"product_id": @"1234"};
    
    // ??????????????? ??????
    [[KLKTalkLinkCenter sharedCenter] sendDefaultWithTemplate:template serverCallbackArgs:serverCallbackArgs success:^(NSDictionary<NSString *,NSString *> * _Nullable warningMsg, NSDictionary<NSString *,NSString *> * _Nullable argumentMsg) {

        // ??????
        NSLog(@"warning message: %@", warningMsg);
        NSLog(@"argument message: %@", argumentMsg);

    } failure:^(NSError * _Nonnull error) {

        // ??????
        [UIAlertController showMessage:error.description];
        NSLog(@"error: %@", error);

    }];
}

- (void)sendLinkScrap {
    
    // ???????????? ???????????? URL
    NSURL *URL = [NSURL URLWithString:@"https://store.kakaofriends.com/"];

    // ??????????????? ??????
    [[KLKTalkLinkCenter sharedCenter] sendScrapWithURL:URL success:^(NSDictionary<NSString *,NSString *> * _Nullable warningMsg, NSDictionary<NSString *,NSString *> * _Nullable argumentMsg) {
        
        // ??????
        NSLog(@"warning message: %@", warningMsg);
        NSLog(@"argument message: %@", argumentMsg);
        
    } failure:^(NSError * _Nonnull error) {
        
        // ??????
        [UIAlertController showMessage:error.description];
        NSLog(@"error: %@", error);
        
    }];
}

- (void)sendLinkCustom {
    
    // ????????? ID
    NSString *templateId = CUSTOM_TEMPLATE_ID;
    // ????????? Arguments
    NSDictionary *templateArgs = @{@"title": @"?????? ???????????????.",
                                   @"description": @"?????? ???????????????."};
    // ???????????? ???????????? ?????? ??????
    NSDictionary *serverCallbackArgs = @{@"user_id": @"abcd",
                                         @"product_id": @"1234"};
    
    // ??????????????? ??????
    [[KLKTalkLinkCenter sharedCenter] sendCustomWithTemplateId:templateId templateArgs:templateArgs serverCallbackArgs:serverCallbackArgs success:^(NSDictionary<NSString *,NSString *> * _Nullable warningMsg, NSDictionary<NSString *,NSString *> * _Nullable argumentMsg) {
        
        // ??????
        NSLog(@"warning message: %@", warningMsg);
        NSLog(@"argument message: %@", argumentMsg);
        
    } failure:^(NSError * _Nonnull error) {
        
        // ??????
        [UIAlertController showMessage:error.description];
        NSLog(@"error: %@", error);
        
    }];
}

- (void)uploadLocalImage {
    UIImagePickerController *picker = [[UIImagePickerController alloc] init];
    picker.delegate = self;
    picker.sourceType = UIImagePickerControllerSourceTypeSavedPhotosAlbum;
    [self presentViewController:picker animated:YES completion:nil];
}

- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary<NSString *,id> *)info {
    [picker dismissViewControllerAnimated:YES completion:nil];
    
    // ???????????? ?????????
    UIImage *sourceImage = info[UIImagePickerControllerOriginalImage];
    
    [[KLKImageStorage sharedStorage] uploadWithImage:sourceImage success:^(KLKImageInfo * _Nonnull original) {
        
        // ????????? ??????
        [UIAlertController showMessage:[NSString stringWithFormat:@"????????? ??????\n%@", original.URL]];

    } failure:^(NSError * _Nonnull error) {
        
        // ????????? ??????
        [UIAlertController showMessage:error.description];
        
    }];
}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
    [picker dismissViewControllerAnimated:YES completion:nil];
}

- (void)scrapRemoteImage {
    
    // ????????? ????????? URL
    NSURL *imageURL = [NSURL URLWithString:@"http://t1.kakaocdn.net/kakaocorp/pw/kakao/ci_kakao.gif"];
    
    [[KLKImageStorage sharedStorage] scrapWithImageURL:imageURL success:^(KLKImageInfo * _Nonnull original) {
        
        // ????????? ??????
        [UIAlertController showMessage:[NSString stringWithFormat:@"????????? ??????\n%@", original.URL]];

    } failure:^(NSError * _Nonnull error) {
        
        // ????????? ??????
        [UIAlertController showMessage:error.description];
        
    }];
}

- (void)showChooseSharingFile {
    [UIAlertController showAlertWithTitle:@""
                                  message:@"?????? ???????"
                                  actions:@[[UIAlertAction actionWithTitle:@"Cancel"
                                                                     style:UIAlertActionStyleCancel
                                                                   handler:nil],
                                            [UIAlertAction actionWithTitle:@"JPG"
                                                                     style:UIAlertActionStyleDefault
                                                                   handler:^(UIAlertAction * _Nonnull action) {
                                                                       [self shareFile:[[NSBundle mainBundle] URLForResource:@"test_img" withExtension:@"jpg"]];
                                                                   }],
                                            [UIAlertAction actionWithTitle:@"MP4"
                                                                     style:UIAlertActionStyleDefault
                                                                   handler:^(UIAlertAction * _Nonnull action) {
                                                                       [self shareFile:[[NSBundle mainBundle] URLForResource:@"test_vod" withExtension:@"mp4"]];
                                                                   }],
                                            [UIAlertAction actionWithTitle:@"TXT"
                                                                     style:UIAlertActionStyleDefault
                                                                   handler:^(UIAlertAction * _Nonnull action) {
                                                                       // kakaotalk not support yet.
                                                                       [self shareFile:[[NSBundle mainBundle] URLForResource:@"test_text" withExtension:@"txt"]];
                                                                   }],
                                            [UIAlertAction actionWithTitle:@"GIF"
                                                                     style:UIAlertActionStyleDefault
                                                                   handler:^(UIAlertAction * _Nonnull action) {
                                                                       // kakaotalk not support yet.
                                                                       [self shareFile:[[NSBundle mainBundle] URLForResource:@"test_gif" withExtension:@"gif"]];
                                                                   }]
                                            ]];
}

- (void)shareFile:(NSURL *)localPath {
    _documentController = [[UIDocumentInteractionController alloc] init];
    _documentController.URL = localPath;
    _documentController.delegate = self;
    [_documentController presentOptionsMenuFromRect:self.view.frame inView:self.view animated:YES];
}

- (void)documentInteractionControllerDidDismissOptionsMenu:(UIDocumentInteractionController *)controller {
    _documentController = nil;
}

- (void)postStory {
    if (![StoryLinkHelper canOpenStoryLink]) {
        NSLog(@"Cannot open kakao story.");
        return;
    }
    
    NSBundle *bundle = [NSBundle mainBundle];
    ScrapInfo *scrapInfo = [[ScrapInfo alloc] init];
    scrapInfo.title = @"Sample";
    scrapInfo.desc = @"Sample ?????????.";
    scrapInfo.imageURLs = @[@"http://www.daumkakao.com/images/operating/temp_mov.jpg"];
    scrapInfo.type = ScrapTypeVideo;
    
    NSString *storyLinkURLString = [StoryLinkHelper makeStoryLinkWithPostingText:@"Sample Story Posting https://www.youtube.com/watch?v=XUX1jtTKkKs"
                                                                     appBundleID:[bundle bundleIdentifier]
                                                                      appVersion:[bundle objectForInfoDictionaryKey:@"CFBundleShortVersionString"]
                                                                         appName:[bundle objectForInfoDictionaryKey:@"CFBundleName"]
                                                                       scrapInfo:scrapInfo];
    [StoryLinkHelper openStoryLinkWithURLString:storyLinkURLString];
}


@end
