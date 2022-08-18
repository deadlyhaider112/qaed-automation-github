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
import {CoreCategoryData, CoreCourses, CoreCoursesProvider} from '@features/courses/services/courses';
import {CoreCourse, CoreCourseProvider} from '@features/course/services/course';
import {CoreCourseHelper, CorePrefetchStatusInfo} from '@features/course/services/course-helper';
import {Translate} from '@singletons';
import {CoreConstants} from '@/core/constants';
import {CoreEnrolledCourseDataWithExtraInfoAndOptions} from '../../services/courses-helper';
import {CoreCoursesCourseOptionsMenuComponent} from '../course-options-menu/course-options-menu';
import {CoreUser} from '@features/user/services/user';
import {ModalController, NavParams} from '@ionic/angular';
import moment from 'moment';
import {DatePipe} from "@angular/common";

/**
 * This component is meant to display a course for a list of courses with progress.
 *
 * Example usage:
 *
 * <core-courses-course-progress [course]="course">
 * </core-courses-course-progress>
 */
@Component({
    selector: 'time-table-component',
    templateUrl: 'time-table.html',
    styleUrls: ['time-table.scss'],
})
export class TimeTableComponent {

    selectedDateTime: any;
    allSessionsList: any;
    filteredSessionsList: any;

    categoryId;

    weekOfMonth = 0;
    dayOfWeek = 0;

    role: any;

    constructor(public modalController: ModalController, public navParams: NavParams) {
        this.selectedDateTime = new Date().toISOString();
        // @ts-ignore
        this.allSessionsList = JSON.parse(localStorage.getItem('course_sessions'));
        console.log(this.allSessionsList);
        this.categoryId = this.navParams.get('categoryId');
        console.log(this.navParams.get('categoryId'));
        this.role = localStorage.getItem('user_role');
        this.onChangeDate();
    }

    onClickCloseDialog(): void {
        this.modalController.dismiss();
    }

    onChangeDate(): void {
        this.filteredSessionsList = [];
        console.log(this.selectedDateTime);
        const selectedDateTimeObject = this.selectedDateTime.split('T')[0];
        for (let i = 0; i < this.allSessionsList.length; i++) {
            if (this.categoryId === this.allSessionsList[i].lms_training_id) {
                this.allSessionsList[i].tsa_start_time = moment(this.allSessionsList[i].tsa_start_time, 'HH:mm:ss').format('hh:mm a').toString();
                this.allSessionsList[i].tsa_end_time = moment(this.allSessionsList[i].tsa_end_time, 'HH:mm:ss').format('hh:mm a').toString();
                // const sessionDate = new Date(this.allSessionsList[i].training_session_date);
                const sessionDate = this.allSessionsList[i].training_session_date;
                console.log(sessionDate);
                console.log(selectedDateTimeObject);
                this.dayOfWeek = this.allSessionsList[i].day_number;
                this.weekOfMonth = this.allSessionsList[i].week_number;
                if (sessionDate == selectedDateTimeObject) {
                    this.filteredSessionsList.push(this.allSessionsList[i]);
                }
            }
        }
        console.log(this.filteredSessionsList);
    }

}
