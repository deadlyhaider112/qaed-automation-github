// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Component, OnInit } from '@angular/core';
import { IonItemOptions, IonRefresher, ModalController } from '@ionic/angular';
import { CoreSites } from '@services/sites';
import { CoreDomUtils } from '@services/utils/dom';
import { CoreUtils, CoreUtilsProvider } from '@services/utils/utils';
// import { CoreCategoryData, CoreCourses, CoreCourseSearchedData } from '../../services/courses';
import { Http, Translate } from '@singletons';
import { CoreNavigator } from '@services/navigator';
import { CoreSiteInfo } from '@classes/site';
import { async } from '@angular/core/testing';
import { CoreError } from '@classes/errors/error';
import { CoreUrlUtils } from '@services/utils/url';
import { CoreApp } from '@services/app';
import { modalController, ModalOptions } from '@ionic/core';
import { ConsentPageComponent } from '@components/consent/consent-page';
import { CoreCategoryData, CoreCourses, CoreCourseSearchedData } from '@features/courses/services/courses';

/**
 * Page that displays the Home.
 */
@Component({
    selector: 'page-core-mainmenu-launch',
    templateUrl: 'launch.html',
    styleUrls: ['launch.scss'],
})
export class CoreMainMenuLaunchPage implements OnInit {

    title: string;
    currentCategory?: CoreCategoryData;
    categories: CoreCategoryData[] = [];
    courses: CoreCourseSearchedData[] = [];
    categoriesLoaded = false;
    siteInfo?: CoreSiteInfo;
    siteName?: string;
    showBanner?= true;
    showStartCourse?= true;
    showHeader?= false;
    siteUrl!: string;
    coursespenttime?: string;
    lastlogintime?: string;
    coursecompletionprogress?: string;
    videoOptions: ModalOptions = {
        component: ConsentPageComponent,
        componentProps: {},
        cssClass: 'custom-consent'
    };
    disclaimer_text?: string;




    protected categoryId = 0;
    showLoadingModal?: boolean;
    userconsentflag?: string;
    intro?: string;

    constructor() {
        this.title = Translate.instant('core.courses.categories');
    }

    /**
     * View loaded.
     */
    ngOnInit(): void {
        const currentSite = CoreSites.getCurrentSite();
        if (!currentSite) {
            return;
        }

        this.siteInfo = currentSite.getInfo();
        this.disclaimer_text =  this.siteInfo?.disclaimer_text;
        console.log(this.siteInfo);
        this.siteName = currentSite.getSiteName();
        this.categoryId = CoreNavigator.getRouteNumberParam('id') || 15;
        this.lastlogintime = this.siteInfo?.lastlogintime;
        this.coursespenttime = this.siteInfo?.coursespenttime;
        this.coursecompletionprogress = this.siteInfo?.coursecompletionprogress;
        this.intro = 'AEO is a mobile administrator who supervises the performance of school in his markaz. Each AEO is assigned 15 to 22 schools, collectedly called markaz, for routine supervision and management. An AEO is the judge on the performance of his/her markaz across a combination of access and quality indicators.';

        this.fetchCategories().finally(() => {
            this.categoriesLoaded = true;
        });

    }

    /**
     * Fetch the categories.
     *
     * @return Promise resolved when done.
     */
    protected async fetchCategories(): Promise<void> {
        try {
            const categories: CoreCategoryData[] = await CoreCourses.getCategories(this.categoryId, true);

            this.currentCategory = undefined;

            const index = categories.findIndex((category) => category.id == this.categoryId);

            if (index >= 0) {
                this.currentCategory = categories[index];
                // Delete current Category to avoid problems with the formatTree.
                delete categories[index];
            }

            // Sort by depth and sortorder to avoid problems formatting Tree.
            categories.sort((a, b) => {
                if (a.depth == b.depth) {
                    return (a.sortorder > b.sortorder) ? 1 : ((b.sortorder > a.sortorder) ? -1 : 0);
                }

                return a.depth > b.depth ? 1 : -1;
            });

            this.categories = CoreUtils.formatTree(categories, 'parent', 'id', this.categoryId);

            if (this.currentCategory) {
                this.title = this.currentCategory.name;



                try {
                    this.courses = await CoreCourses.getCoursesByField('category', this.categoryId);

                } catch (error) {
                    CoreDomUtils.showErrorModalDefault(error, 'core.courses.errorloadcourses', true);
                }
            }
        } catch (error) {
            CoreDomUtils.showErrorModalDefault(error, 'core.courses.errorloadcategories', true);
        }
    }

    /**
     * Refresh the categories.
     *
     * @param refresher Refresher.
     */
    refreshCategories(refresher?: IonRefresher): void {
        const promises: Promise<void>[] = [];

        promises.push(CoreCourses.invalidateUserCourses());
        promises.push(CoreCourses.invalidateCategories(this.categoryId, true));
        promises.push(CoreCourses.invalidateCoursesByField('category', this.categoryId));
        promises.push(CoreSites.getCurrentSite()!.invalidateConfig());

        Promise.all(promises).finally(() => {
            this.fetchCategories().finally(() => {
                refresher?.complete();
            });
        });
    }

    /**
     * Open a category.
     *
     * @param categoryId Category Id.
     */
    openCategory(categoryId: number): void {
        CoreNavigator.navigateToSitePath('courses/categories/' + categoryId);
    }

    // @ViewChild(CoreTabsOutletComponent) tabsComponent?: CoreTabsOutletComponent;

    // siteName!: string;
    // tabs: CoreTabsOutletTab[] = [];
    // loaded = false;
    // selectedTab?: number;

    // protected subscription?: Subscription;
    // protected updateSiteObserver?: CoreEventObserver;
    // protected pendingRedirect?: CoreRedirectPayload;
    // protected urlToOpen?: string;

    // constructor(
    //     protected route: ActivatedRoute,
    // ) {
    // }

    // /**
    //  * Initialize the component.
    //  */
    // ngOnInit(): void {
    //     this.route.queryParams.subscribe((params: Partial<CoreRedirectPayload> & { urlToOpen?: string }) => {
    //         this.urlToOpen = params.urlToOpen ?? this.urlToOpen;

    //         if (params.redirectPath) {
    //             this.pendingRedirect = {
    //                 redirectPath: params.redirectPath,
    //                 redirectOptions: params.redirectOptions,
    //             };
    //         }
    //     });

    //     this.loadSiteName();

    //     this.subscription = CoreMainMenuHomeDelegate.getHandlersObservable().subscribe((handlers) => {
    //         handlers && this.initHandlers(handlers);
    //     });

    //     // Refresh the enabled flags if site is updated.
    //     this.updateSiteObserver = CoreEvents.on(CoreEvents.SITE_UPDATED, () => {
    //         this.loadSiteName();
    //     }, CoreSites.getCurrentSiteId());
    // }

    // /**
    //  * Init handlers on change (size or handlers).
    //  */
    // initHandlers(handlers: CoreMainMenuHomeHandlerToDisplay[]): void {
    //     // Re-build the list of tabs.
    //     const loaded = CoreMainMenuHomeDelegate.areHandlersLoaded();
    //     const handlersMap = CoreUtils.arrayToObject(handlers, 'title');
    //     const newTabs = handlers.map((handler): CoreTabsOutletTab => {
    //         const tab = this.tabs.find(tab => tab.title == handler.title);

    //         // If a handler is already in the list, use existing object to prevent re-creating the tab.
    //         if (tab) {
    //             return tab;
    //         }

    //         return {
    //             page: `/main/home/${handler.page}`,
    //             pageParams: handler.pageParams,
    //             title: handler.title,
    //             class: handler.class,
    //             icon: handler.icon,
    //             badge: handler.badge,
    //         };
    //     });

    //     // Sort them by priority so new handlers are in the right position.
    //     newTabs.sort((a, b) => (handlersMap[b.title].priority || 0) - (handlersMap[a.title].priority || 0));

    //     if (typeof this.selectedTab == 'undefined' && newTabs.length > 0) {
    //         let maxPriority = 0;

    //         this.selectedTab = Object.entries(newTabs).reduce((maxIndex, [index, tab]) => {
    //             const selectPriority = handlersMap[tab.title].selectPriority ?? 0;

    //             if (selectPriority > maxPriority) {
    //                 maxPriority = selectPriority;
    //                 maxIndex = Number(index);
    //             }

    //             return maxIndex;
    //         }, 0);
    //     }

    //     this.tabs = newTabs;

    //     // Try to prevent empty box displayed for an instant when it shouldn't.
    //     setTimeout(() => {
    //         this.loaded = loaded;
    //     }, 50);
    // }

    // /**
    //  * Load the site name.
    //  */
    // protected loadSiteName(): void {
    //     this.siteName = CoreSites.getCurrentSite()!.getSiteName();

    // }

    // /**
    //  * Handle a redirect.
    //  *
    //  * @param data Data received.
    //  */
    // protected handleRedirect(data: CoreRedirectPayload): void {
    //     const params = data.redirectOptions?.params;
    //     const coursePathMatches = data.redirectPath.match(/^course\/(\d+)\/?$/);

    //     if (coursePathMatches) {
    //         if (!params?.course) {
    //             CoreCourseHelper.getAndOpenCourse(Number(coursePathMatches[1]), params);
    //         } else {
    //             CoreCourse.openCourse(params.course, params);
    //         }
    //     } else {
    //         CoreNavigator.navigateToSitePath(data.redirectPath, {
    //             ...data.redirectOptions,
    //             preferCurrentTab: false,
    //         });
    //     }
    // }

    // /**
    //  * Handle a URL to open.
    //  *
    //  * @param url URL to open.
    //  */
    // protected async handleUrlToOpen(url: string): Promise<void> {
    //     const actions = await CoreContentLinksDelegate.getActionsFor(url, undefined);

    //     const action = CoreContentLinksHelper.getFirstValidAction(actions);
    //     if (action) {
    //         action.action(action.sites![0]);
    //     }
    // }

    // /**
    //  * Tab was selected.
    //  */
    // tabSelected(): void {
    //     if (this.pendingRedirect) {
    //         this.handleRedirect(this.pendingRedirect);
    //     } else if (this.urlToOpen) {
    //         this.handleUrlToOpen(this.urlToOpen);
    //     }

    //     delete this.pendingRedirect;
    //     delete this.urlToOpen;
    // }

    // /**
    //  * User entered the page.
    //  */
    // ionViewDidEnter(): void {
    //     this.tabsComponent?.ionViewDidEnter();
    // }

    // /**
    //  * User left the page.
    //  */
    // ionViewDidLeave(): void {
    //     this.tabsComponent?.ionViewDidLeave();
    // }

}
