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

import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {CoreSites} from '@services/sites';
import {CoreDomUtils} from '@services/utils/dom';
import {CoreCourses, CoreCoursesProvider} from '@features/courses/services/courses';
import {CoreCourse, CoreCourseProvider} from '@features/course/services/course';
import {CoreCourseHelper, CorePrefetchStatusInfo} from '@features/course/services/course-helper';
import {Translate} from '@singletons';
import {CoreConstants} from '@/core/constants';
import {CoreEnrolledCourseDataWithExtraInfoAndOptions} from '../../services/courses-helper';
import {CoreCoursesCourseOptionsMenuComponent} from '../course-options-menu/course-options-menu';
import {CoreUser} from '@features/user/services/user';
import {ModalController} from "@ionic/angular";

/**
 * This component is meant to display a course for a list of courses with progress.
 *
 * Example usage:
 *
 * <core-courses-course-progress [course]="course">
 * </core-courses-course-progress>
 */
@Component({
    selector: 'upcoming-trainings-apply-alert-component',
    templateUrl: 'upcoming-training-alert.html',
    styleUrls: ['upcoming-training-alert.scss'],
})
export class UpcomingTrainingsApplyAlertComponent {

    constructor(public modalController: ModalController) {
    }

    onClickCloseDialog() {
        this.modalController.dismiss();
    }

}
