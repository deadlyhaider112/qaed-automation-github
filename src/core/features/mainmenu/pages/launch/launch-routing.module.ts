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

import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';

import { ModuleRoutesConfig } from '@/app/app-routing.module';

export const MAIN_MENU_LAUNCH_ROUTES = new InjectionToken('MAIN_MENU_LAUNCH_ROUTES');

@NgModule()
export class CoreMainMenuLaunchRoutingModule {

    static forChild(routes: ModuleRoutesConfig): ModuleWithProviders<CoreMainMenuLaunchRoutingModule> {
        return {
            ngModule: CoreMainMenuLaunchRoutingModule,
            providers: [
                { provide: MAIN_MENU_LAUNCH_ROUTES, multi: true, useValue: routes },
            ],
        };
    }

}
