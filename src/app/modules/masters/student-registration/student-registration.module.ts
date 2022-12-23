import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRegistrationRoutingModule } from './student-registration-routing.module';
import { StudentRegistrationComponent } from './student-registration.component';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import { RegisterStudentComponent } from './register-student/register-student.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { TableGridComponent } from "../../../shared/components/table-grid/table-grid.component";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        StudentRegistrationComponent,
        RegisterStudentComponent
    ],
    imports: [
        CommonModule,
        StudentRegistrationRoutingModule,
        MatCardModule,
        MatSelectModule,
        MatIconModule,
        MatInputModule,
        MatDatepickerModule,
        MatDialogModule,
        MatMenuModule,
        MatButtonModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        FormsModule,
        TableGridComponent,
        TranslateModule
    ]
})
export class StudentRegistrationModule { }

// "student":{
//     "kendra":"Kendra",
//     "school":"School",
//     "search_by_saralid_name_mobileno":"Search By SaralId/Name/MobileNo",
//     "saral_id":"Saral Id",
//     "name":"Name",
//     "gender":"Gender",
//     "standard":"Standard",
//     "parent_contact_no":"Parent Contact Number",
//     "name":"Name",
//     "contact_person":"Contact Person",
//     "mobile_number":"Mobile Number",
//     "email":"Email Id",
//     "select_taluka":"Select Taluka",
//     "select_kendra":"Select Kendra",
//     "select_school":"Select School",
//     "select_standard":"Select Standard",
//     "enter_parent_contact_number":"Enter Parent Contact Number",
//     "enter_first_name":"Enter First Name"
// "enter_middle_name":"Enter Middle Name",
//  "enter_last_name":"Enter Last Name",
// "enter_caste":"Enter Caste",
// "taluka_is_required":"Taluka Is Required",
// "kendra_is_required":"Kendra Is Required",
// "school_is_required":"School Is Required",
// "standard_is_required":"Standard Is Required",
// "please_enter_contact_number":"Please Enter Contact Name",
// "please_enter_first_name":"Please Enter First Name",
// "please_enter_middle_name":"Please Enter Middle Name",
// "please_enter_last_name":"Please Enter Last Name",
// "please_enter_saral_id":"Please Enter Saral Id",
// "gender_is_required":"Gender Is Required",
// "birth_date_is_required":"Birth Date Is Required",
// "please_enter_aadhar_number":"Please Enter Aadhar Number",
// "religion_is_required":"Religion Is Required",
// "please_enter_caste_name":"Please Enter Caste Name",
// "are_you_want_to_delete_student_record":"Are you want To Delete Student Record?",
// "student_registration":"Student Registration",
// "student_list":"Student List",
// "register_student":"Register Student",
// "delete":"Delete",
// },

// "student":{
//     "kendra":"केंद्र",
//     "school":"शाळा",
//     "search_by_saralid_name_mobileno":"सरलआयडी/नाव/मोबाइल नंबर द्वारे शोधा",
//     "saral_id":"सरल आयडी",
//     "name":"नाव",
//     "gender":"लिंग",
//     "standard":"इयत्ता",
//     "parent_contact_no":"पालक संपर्क क्रमांक",
//     "name":"नाव",
//     "contact_person":"संपर्क व्यक्ती",
//     "mobile_number":"मोबाइल नंबर",
//     "email":"ईमेल आयडी",
//     "select_taluka":"तालुका निवडा",
//     "select_kendra":"केंद्र निवडा",
//     "select_school":"शाळा निवडा",
//     "select_standard":"इयत्ता निवडा",
//     "enter_parent_contact_number":"पालक संपर्क क्रमांक प्रविष्ट करा",
//     "enter_first_name":"प्रथम नाव प्रविष्ट करा"
//     "enter_middle_name":"मधले नाव प्रविष्ट करा",
//     "enter_last_name":"आडनाव प्रविष्ट करा",
//      "enter_caste":"जात प्रविष्ट करा",
//      "taluka_is_required":"तालुका आवश्यक आहे",
// "kendra_is_required":"केंद्र आवश्यक आहे",
// "school_is_required":"शाळा आवश्यक आहे",
// "standard_is_required":"मानक आवश्यक आहे",
// "please_enter_contact_number":"कृपया संपर्क नाव प्रविष्ट करा",
// "please_enter_first_name":"कृपया प्रथम नाव प्रविष्ट करा",
// "please_enter_middle_name":"कृपया मधले नाव प्रविष्ट करा",
// "please_enter_last_name":"कृपया आडनाव प्रविष्ट करा",
// "please_enter_saral_id":"कृपया सरल आयडी प्रविष्ट करा",
// "gender_is_required":"लिंग आवश्यक आहे",
// "birth_date_is_required":"जन्मतारीख आवश्यक आहे",
// "please_enter_aadhar_number":"कृपया आधार क्रमांक प्रविष्ट करा",
// "religion_is_required":"धर्म आवश्यक आहे",
// "please_enter_caste_name":"कृपया जातीचे नाव प्रविष्ट करा",
// "are_you_want_to_delete_student_record":"तुम्हाला विद्यार्थी रेकॉर्ड हटवायचा आहे का ?",
// "student_registration":"विद्यार्थी नोंदणी",
// "student_list":"विद्यार्थ्यांची यादी",
// "register_student":"विद्यार्थ्याची नोंदणी करा",
// "delete":"हटवा",
// },