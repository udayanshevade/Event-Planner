"use strict";angular.module("eventPlannerApp",["ui.router","firebase","ngMessages","ngTagsInput","ngResource","ngSanitize","ngStorage","ngAria","ngAnimate","ngMaterial","ui.timepicker"]).config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/welcome"),a.state("register",{url:"/register",templateUrl:"views/register.html",data:{needLoggedIn:!1}}).state("login",{url:"/login",templateUrl:"views/login.html",data:{needLoggedIn:!1}}).state("dashboard",{url:"/welcome",templateUrl:"views/dashboard.html",data:{needLoggedIn:!0}}).state("account",{url:"/account",templateUrl:"views/account.html",data:{needLoggedIn:!0}}).state("create",{url:"/create",templateUrl:"views/create.html",data:{needLoggedIn:!0}}).state("event",{url:"/events/:eventID",templateUrl:"views/event.html",data:{needLoggedIn:!0}}).state("event-edit",{url:"/events/:eventID/edit",templateUrl:"views/eventEdit.html",data:{needLoggedIn:!0,needHostAccess:!0}}).state("users",{url:"/users",templateUrl:"views/users.html",data:{needLoggedIn:!0}}).state("user",{url:"/users/:handle",templateUrl:"views/user.html",data:{needLoggedIn:!0}})}]).run(["$rootScope","$state","$log","usercreds",function(a,b,c,d){a.$on("$stateChangeStart",function(e,f){var g=f.data;g&&g.needLoggedIn&&!d.loggedIn?(c.log("Nope, back to login."),a.loggedIn=!1,c.log(a.loggedIn),e.preventDefault(),b.go("login")):g&&!g.needLoggedIn&&d.loggedIn&&(c.log("To the dashboard with you!"),a.loggedIn=!0,c.log(a.loggedIn),e.preventDefault(),b.go("dashboard"))}),a.$on("$stateChangeSuccess",function(c,d,e,f,g){if("dashboard"===b.current.name)a.previousStates=[];else{a.previousStates=a.previousStates||[];var h=a.previousStates.length;if(!a.backing&&f.name){var i={name:f.name,params:g};a.previousStates.push(i)}h&&b.current.name===a.previousStates[h-1].name&&a.previousStates.pop(),a.backing=!1}})}]),angular.module("eventPlannerApp").service("usercreds",["$firebaseObject","$firebaseArray",function(a,b){var c=this;this.user={},this.loginSuccess=function(){this.user=a(c.ref),this.accountRef=this.ref.child("account"),this.contactsRef=this.ref.child("contacts"),this.contacts=a(c.contactsRef),this.contactsArray=b(c.contactsRef),this.account=a(c.accountRef),this.updateCredentials(),this.loggedIn=!0,this.createdEventsRef=this.ref.child("created"),this.invitedEventsRef=this.ref.child("invited"),this.createdEvents=b(c.createdEventsRef),this.createdEventsObject=a(c.createdEventsRef),this.invitedEvents=b(c.invitedEventsRef),this.invitedEventsObject=a(c.createdEventsRef)},this.logout=function(){this.loggedIn=!1,this.user={account:{}},this.assignCredentials()},this.updateCredentials=function(){this.user.$loaded(function(){c.assignCredentials()})},this.assignCredentials=function(){this.email=this.user.account.email,this.name=this.user.account.name,this.username=this.user.$id,this.password=this.user.account.password,this.employer=this.user.account.employer,this.position=this.user.account.position,this.blurb=this.user.account.blurb,this.birthday=this.user.account.birthday?new Date(this.user.account.birthday):null}}]),angular.module("eventPlannerApp").service("createDetails",function(){this.reset=function(){for(var a in this)"reset"!==a&&this.hasOwnProperty(a)&&(this[a]="")}}),angular.module("eventPlannerApp").service("validateTimes",function(){this.compare=function(a,b){return a=a.getTime(),b=b.getTime(),b>a?"earlier":a===b?"same":"later"}}),angular.module("eventPlannerApp").directive("ngAutofocus",["$timeout",function(a){return{link:function(b,c){a(function(){c.focus()})}}}]);var eventPlannerApp=angular.module("eventPlannerApp");eventPlannerApp.directive("passwordMatch",function(){return{restrict:"A",require:"ngModel",scope:{password:"@passwordMatch"},link:function(a,b,c,d){d.$validators.passwordMatch=function(b,c){return d.$isEmpty(b)?!0:a.password===c}}}}),eventPlannerApp.directive("newUser",function(){return{restrict:"A",require:"ngModel",scope:{checkUsers:"&newUser"},link:function(a,b,c,d){d.$validators.newUser=function(b,c){return d.$isEmpty(b)?!0:!a.checkUsers({un:c})}}}}),eventPlannerApp.directive("validRef",function(){function a(a){return"string"==typeof a&&a.length&&!a.match(/[.$\[\]#\/]/)}return{restrict:"A",require:"ngModel",link:function(b,c,d,e){e.$validators.validRef=function(b,c){return e.$isEmpty(b)?!0:a(c)}}}}),eventPlannerApp.directive("hasNum",function(){function a(a){return/\d/.test(a)}return{restrict:"A",require:"ngModel",link:function(b,c,d,e){e.$validators.hasNum=function(b,c){return e.$isEmpty(b)?!0:a(c)}}}}),eventPlannerApp.directive("hasUpperCase",function(){function a(a){return a.toLowerCase()!==a}return{restrict:"A",require:"ngModel",link:function(b,c,d,e){e.$validators.hasUpperCase=function(b,c){return e.$isEmpty(b)?!0:a(c)}}}}),eventPlannerApp.directive("hasLowerCase",function(){function a(a){return a.toUpperCase()!==a}return{restrict:"A",require:"ngModel",link:function(b,c,d,e){e.$validators.hasLowerCase=function(b,c){return e.$isEmpty(b)?!0:a(c)}}}}),angular.module("eventPlannerApp").directive("eventPreview",function(){return{restrict:"E",templateUrl:"../../views/partials/eventPreview.html",replace:!0,controller:"EventPreviewCtrl",controllerAs:"eventPreview",scope:{eventDetails:"=",eventsRef:"=",users:"=",usersRef:"=",events:"="}}}),angular.module("eventPlannerApp").directive("userPreview",function(){return{restrict:"E",templateUrl:"../../views/partials/userPreview.html",replace:!0,controller:"UserPreviewCtrl",controllerAs:"userPreview",scope:{userData:"=",usersRef:"=",username:"="}}});var m=angular.module("ui.timepicker",[]);m.value("uiTimepickerConfig",{step:15}),m.directive("uiTimepicker",["uiTimepickerConfig","$parse","$window","validateTimes",function(a,b,c,d){var e=c.moment,f=function(a){return void 0!==e&&e.isMoment(a)&&a.isValid()},g=function(a){return null!==a&&(angular.isDate(a)||f(a))};return{restrict:"A",require:"ngModel",scope:{ngModel:"=",baseDate:"=",uiTimepicker:"=",relatedDate:"=",earlierThan:"=",earlierThanDate:"=",laterThan:"=",laterThanDate:"="},priority:1,link:function(b,c,h,i){var j=angular.copy(a),k=j.asMoment||!1;delete j.asMoment,i.$render=function(){var a=i.$modelValue;if(angular.isDefined(a)){if(null!==a&&""!==a&&!g(a))throw new Error("ng-Model value must be a Date or Moment object - currently it is a "+typeof a+".");if(f(a)&&(a=a.toDate()),c.is(":focus")||n()||c.timepicker("setTime",a),null===a&&l(),b.earlierThan&&b.earlierThanDate&&b.relatedDate)switch(d.compare(b.relatedDate,b.earlierThanDate)){case"later":break;case"same":"earlier"===d.compare(i.$modelValue,b.earlierThan)?i.$setValidity("earlierThan",!0):i.$setValidity("earlierThan",!1);break;case"earlier":i.$setValidity("earlierThan",!0)}if(b.laterThan&&b.laterThanDate&&b.relatedDate)switch(d.compare(b.relatedDate,b.laterThanDate)){case"earlier":break;case"same":"later"===d.compare(i.$modelValue,b.laterThan)?i.$setValidity("laterThan",!0):i.$setValidity("laterThan",!1);break;case"later":i.$setValidity("laterThan",!0)}}},b.$watchCollection("[ngModel, relatedDate, laterThanDate, earlierThanDate, laterThan, earlierThan]",function(){i.$render()},!0),j.appendTo=j.appendTo||c.parent(),c.timepicker(angular.extend(j,b.uiTimepicker?b.uiTimepicker:{}));var l=function(){c.timepicker("setTime",null)},m=function(){return c.val().trim()},n=function(){return m()&&null===i.$modelValue};c.on("$destroy",function(){c.timepicker("remove")});var o=function(){var a=i.$modelValue?i.$modelValue:b.baseDate;return f(a)?a.toDate():a},p=function(a){return k?e(a):a};c.is("input")?(i.$parsers.unshift(function(){var a=c.timepicker("getTime",o());return a?p(a):a}),i.$validators.time=function(a){return h.required||m()?g(a):!0}):c.on("changeTime",function(){b.$evalAsync(function(){var a=c.timepicker("getTime",o());i.$setViewValue(a)})})}}}]),angular.module("eventPlannerApp").controller("HeaderCtrl",["$rootScope","$scope","usercreds","createDetails",function(a,b,c,d){this.logout=function(){for(var e in b.$storage.eventPlannerApp)delete b.$storage.eventPlannerApp[e];c.logout(),d.reset(),a.loggedIn=!1,b.changeState("login")}}]),angular.module("eventPlannerApp").controller("MainCtrl",["$rootScope","$scope","usercreds","$window","$firebaseObject","$firebaseArray","$state","$localStorage",function(a,b,c,d,e,f,g,h){b.$storage=h,b.usersRef=new d.Firebase("https://fendeventplanner.firebaseio.com/users"),b.eventsRef=new d.Firebase("https://fendeventplanner.firebaseio.com/events");var i=b.$storage.eventPlannerApp;if(i){var j=a.loggedIn=b.$storage.eventPlannerApp.loggedIn;if(j){var k=b.$storage.eventPlannerApp.username;c.ref=b.usersRef.child(k),c.loginSuccess()}}else b.$storage.eventPlannerApp={},b.$storage.eventPlannerApp.loggedIn=!1;b.users=e(b.usersRef),b.usersArray=f(b.usersRef),b.events=f(b.eventsRef),b.eventsObject=e(b.eventsRef),b.changeState=function(c,d){if("previous"===c&&a.previousStates){a.backing=!0;var e=a.previousStates.pop();b.changeState(e.name,e.params)}else d?g.go(c,d):g.go(c)}}]),angular.module("eventPlannerApp").controller("RegCtrl",["$rootScope","$scope","$log","usercreds",function(a,b,c,d){var e=this;d.username&&(e.username=d.username),b.$watch(function(){return e.username},function(a){d.username=a}),this.passwordConfirm="",this.registerUser=function(){this.password!==this.passwordConfirm||this.checkUser(this.username)||this.addNewUser(this.username,this.email,this.password)},this.checkUser=function(a){for(var d in b.users)if(b.users.hasOwnProperty(d)&&d===a)return c.log("This username has already been taken."),!0;return!1},this.addNewUser=function(f,g,h){b.users[f]={account:{email:g,password:h}},b.users.$save().then(function(){a.loggedIn=b.$storage.eventPlannerApp.loggedIn=!0,b.$storage.eventPlannerApp.username=e.username;var c=b.$storage.eventPlannerApp.username;d.ref=b.usersRef.child(c),d.accountRef=d.ref.child("account"),d.loginSuccess(),b.changeState("dashboard")},function(a){c.log(a)})}}]),angular.module("eventPlannerApp").controller("LoginCtrl",["$rootScope","$scope","$log","$firebaseObject","usercreds",function(a,b,c,d,e){for(var f,g,h=this,i=["username","email"],j=function(a){return function(){return h[a]}},k=function(a){return function(b){e[a]=b}},l=0,m=i.length;m>l;l++){var n=[i[l]];e[n]&&(h[n]=e[n]),f=j(n),g=k(n),b.$watch(f,g)}this.failure=!1,this.loginUser=function(){var a,d=this.username||this.email,e=b.users;if("none"!==e.$value)for(var f in e)if(a=!1,e.hasOwnProperty(f)){switch(d){case this.username:f===this.username&&(a=!0);break;case this.email:var g=e[f];g&&g.account&&g.account.email===this.email&&(a=!0,this.username=f);break;default:c.log("No matches.")}if(a&&this.verifyPassword(f)){this.loginSuccess();break}this.failure=!0}},this.verifyPassword=function(a){return b.users[a].account.password===this.password?(c.log("Logging in."),!0):!1},this.loginSuccess=function(){this.failure=!1,a.loggedIn=b.$storage.eventPlannerApp.loggedIn=!0,b.$storage.eventPlannerApp.email=this.email,b.$storage.eventPlannerApp.username=this.username;var c=b.$storage.eventPlannerApp.username;e.ref=b.usersRef.child(c),e.accountRef=e.ref.child("account"),e.loginSuccess(),b.changeState("dashboard")}}]),angular.module("eventPlannerApp").controller("DashCtrl",["$scope","usercreds",function(a,b){var c=this;this.loading=!0,b.user.$loaded(function(){c.username=b.name||b.user.$id,c.usercredsLoaded=!0,c.checkIfLoaded()}),b.createdEvents.$loaded(function(){c.createdEvents=b.createdEvents,c.openTab=c.createdEvents.length?0:1,c.createdEventsLoaded=!0,c.checkIfLoaded()}),b.invitedEvents.$loaded(function(){c.invitedEvents=b.invitedEvents,c.invitedEventsLoaded=!0,c.checkIfLoaded()}),this.checkIfLoaded=function(){this.usercredsLoaded&&this.createdEventsLoaded&&this.invitedEventsLoaded&&(this.loading=!1)}}]),angular.module("eventPlannerApp").controller("AccountCtrl",["$scope","usercreds",function(a,b){var c=this;this.loading=!0,b.user.$loaded(function(){c.reset()}),this.reset=function(){c.username=b.username,c.name=b.name||"",c.email=b.email,c.password=b.password,c.birthday=b.birthday,c.employer=b.employer||"",c.position=b.position||"",c.blurb=b.blurb||"",c.loading=!1},this.editAccount=function(){if(a.accountForm.$valid){c.birthday&&(c.birthdayString=c.birthday.toDateString());var d={name:c.name,email:c.email,password:c.password,birthday:c.birthdayString,employer:c.employer,position:c.position,blurb:c.blurb};a.users[c.username].account=d,a.users.$save().then(function(){b.updateCredentials(),a.changeState("dashboard")},function(){})}}}]),angular.module("eventPlannerApp").controller("CreateCtrl",["$scope","usercreds","createDetails","$firebaseArray",function(a,b,c,d){for(var e,f,g=this,h=["name","host","location","type","startTime","endTime","message","guestList","startDate","endDate"],i=function(a){return function(){return g[a]}},j=function(a){return function(b){c[a]=b}},k=0,l=h.length;l>k;k++)c[h[k]]||(e=i(h[k]),f=j(h[k]),a.$watch(e,f));this.reset=function(){this.name=c.name||"",this.creator=b.user.$id||"",this.host=c.host||b.user.$id||b.user.username||"",this.location=c.location||"",this.type=c.type||"",this.currentTime=new Date,this.startTime=c.startTime||new Date,this.endTime=c.endTime||new Date((new Date).setHours(g.startTime.getHours()+1)),this.defaultTypes=["Conference","Wedding","Reunion","Birthday","Party"],this.message=c.message||"",this.guestList=c.guestList||[b.user.$id],this.startDate=c.startDate||new Date,this.startDate.setHours(0,0,0,0),this.endDate=c.endDate||new Date,this.endDate.setHours(0,0,0,0),this.currentDate=new Date,this.currentDate.setHours(0,0,0,0),this.event={}},this.loadContacts=function(){var a=b.contactsArray.map(function(a){return a.$id});return a},this.createEvent=function(){a.createForm.$valid&&(this.startDateString=this.startDate.toDateString(),this.endDateString=this.endDate.toDateString(),this.startTimeString=this.startTime.toTimeString(),this.endTimeString=this.endTime.toTimeString(),this.event={creator:g.creator,name:g.name,host:g.host,location:g.location,startDate:g.startDateString,endDate:g.endDateString,startTime:g.startTimeString,endTime:g.endTimeString,type:g.type,guests:g.guestList,message:g.message},a.events.$add(g.event).then(function(d){var e=d.key();b.createdEvents.$add({event:e}),g.inviteGuests(e);for(var f=0,i=h.length;i>f;f++)g[h[f]]=null;c.reset(),a.changeState("dashboard")},function(){}))},this.inviteGuests=function(a){this.guestList.forEach(function(c){c.text!==b.user.$id&&g.inviteGuest(c.text,a)})},this.inviteGuest=function(b,c){if(a.users[b]){var e=a.usersRef.child(b).child("invited"),f=d(e);f.$loaded().then(function(){f.$add({event:c}).then(function(){},function(){})})}},b.user.$loaded(function(){g.reset()}),this.reset()}]),angular.module("eventPlannerApp").controller("EventPreviewCtrl",["$scope","usercreds","$firebaseObject","$firebaseArray","$mdDialog",function(a,b,c,d,e){var f=this;f.eventKey=a.eventDetails.event,f.event=c(a.eventsRef.child(f.eventKey)),f.createdEvent=c(b.createdEventsRef.child(a.eventDetails.$id)),a.events.$loaded(function(){f.eventData=a.events[f.eventKey],f.loaded=!0,f.hasHostAccess=f.eventData.host===b.username||f.eventData.creator===b.username}),this.confirmDelete=function(a){var b=e.confirm().title("Remove Event").textContent("Are you sure you want to remove this event? Removing it will erase the event completely.").ariaLabel("Remove Event").targetEvent(a).ok("Remove it").cancel("Not now");e.show(b).then(function(){f["delete"]()},function(){})},this["delete"]=function(){f.event.$loaded().then(function(){f.deleteInvites(),f.event.$remove().then(function(){f.createdEvent.$loaded().then(function(){f.createdEvent.$remove().then(function(){},function(){})},function(){})})})},this.deleteInvites=function(){var b;angular.forEach(f.event.guests,function(c){b=c.text,a.users[b]&&a.users[b].invited&&f.deleteInvite(b)})},this.deleteInvite=function(b){var c,e=a.usersRef.child(b).child("invited"),g=d(e);g.$loaded().then(function(){angular.forEach(g,function(a,b){a.event===f.eventKey&&(c=g[b],g.$remove(c).then(function(){},function(){}))})},function(){})}}]),angular.module("eventPlannerApp").controller("EventCtrl",["$scope","$stateParams","usercreds",function(a,b,c){var d=this;this.loading=!0,this.eventID=b.eventID,this.details=null,a.events.$loaded(function(){angular.forEach(a.events,function(a){a.$id===d.eventID&&(d.details=a)}),d.timeZone=d.details.startTime.substring(17),d.startTime=d.details.startTime.substring(0,5),d.endTime=d.details.endTime.substring(0,5);var b=d.details.host,e=d.details.creator;c.user.$loaded(function(){d.hasHostAccess=b===c.username||b===c.user.$id||e===c.username||e===c.user.$id}),d.loading=!1})}]),angular.module("eventPlannerApp").controller("EditCtrl",["$rootScope","$scope","$stateParams","usercreds","$firebaseArray",function(a,b,c,d,e){var f=this;this.eventID=c.eventID,f.loading=!0,b.eventsObject.$loaded(function(){for(var a in b.eventsObject)a===c.eventID&&(f.details=b.eventsObject[a],f.blockEditing());f.timeZone=f.details.startTime.substring(17),f.startTime=f.details.startTime.substring(0,5),f.endTime=f.details.endTime.substring(0,5),f.reset(),f.loading=!1}),this.reset=function(){this.name=this.details.name,this.creator=this.details.creator,this.host=this.details.host,this.location=this.details.location,this.type=this.details.type,this.currentTime=new Date,this.currentDate=new Date,this.currentDate.setHours(0,0,0,0),this.startDate=new Date(f.details.startDate)||null,this.endDate=new Date(f.details.endDate)||null,console.log(this.startDate),console.log(this.endDate),this.startTime=new Date(f.details.startDate+" "+f.details.startTime),this.endTime=new Date(f.details.endDate+" "+f.details.endTime),this.defaultTypes=["Conference","Wedding","Reunion","Birthday","Party"],this.message=this.details.message||"",this.guestList=this.details.guests||[],this.cachedGuestList=[],this.guestList.forEach(function(a){f.cachedGuestList.push(a)}),this.removedGuests=[]},this.loadContacts=function(){var a=d.contactsArray.map(function(a){return a.$id});return a},this.editEvent=function(){b.editForm.$valid&&(f.loading=!0,this.startDateString=this.startDate.toDateString(),this.endDateString=this.endDate.toDateString(),this.startTimeString=this.startTime.toTimeString(),this.endTimeString=this.endTime.toTimeString(),f.event={creator:f.creator,name:f.name,host:f.host,location:f.location,startDate:f.startDateString,endDate:f.endDateString,startTime:f.startTimeString,endTime:f.endTimeString,type:f.type,guests:f.guestList,message:f.message},b.eventsObject[f.eventID]=f.event,b.eventsObject.$save().then(function(){var a=f.cachedGuestList.every(function(a,b){return f.guestList[b]?a.text===f.guestList[b].text:!1}),c=a&&f.cachedGuestList.length===f.guestList.length;c?f.updateInvites():f.editInvites(),f.loading=!1,b.changeState("event",{eventID:f.eventID})},function(){f.loading=!1}))},this.editInvites=function(){this.removeInvites()},this.removeInvites=function(){var a,c,d,g;this.removedGuests.length?this.removedGuests.forEach(function(h){a=b.usersRef.child(h),a&&(c=a.child("invited"),c&&(d=e(c),d.$loaded().then(function(){angular.forEach(d,function(a,b){a.event===f.eventID&&(g=d[b])}),d.$remove(g).then(function(){f.updateInvites()},function(){})})))}):this.updateInvites()},this.updateInvites=function(){var a,c,d;this.guestList.forEach(function(g){var h,i,j;a=b.users[g.text],d=g.text===f.creator,a&&!d&&(c=b.usersRef.child(g.text),i=c.child("invited"),h=e(i),h.$loaded(function(){j=!1,angular.forEach(h,function(a){a.event===f.eventID&&(j=!0)}),j||h.$add({event:f.eventID}).then(function(){},function(){})}))})},this.removeTag=function(a){this.removedGuests.push(a.text)},this.blockEditing=function(){d.user.$loaded(function(){f.hasHostAccess=f.details.host===d.username||f.details.host===d.user.$id||f.details.creator===d.username||f.details.creator===d.user.$id,f.hasHostAccess||(a.backing=!0,b.changeState("event",{eventID:c.eventID}))})}}]),angular.module("eventPlannerApp").controller("UsersCtrl",["$scope","usercreds",function(a,b){var c=this;this.loading=!0,this.users=null,a.users.$loaded().then(function(){c.users=a.usersArray,c.loading=!1}),b.contactsArray.$loaded().then(function(){c.contacts=b.contactsArray,c.loading=!1}),b.user.$loaded().then(function(){c.self=b.username})}]),angular.module("eventPlannerApp").controller("UserCtrl",["$rootScope","$scope","usercreds","$stateParams","$firebaseObject",function(a,b,c,d,e){var f=this;this.username=d.handle,this.loading=!0,b.users.$loaded(function(){var a=b.users[f.username];a?(f.exists=!0,f.details=a.account,f.name=f.details.name,f.email=f.details.email,f.birthday=f.details.birthday,f.employer=f.details.employer,f.position=f.details.position,f.blurb=f.details.blurb,f.isContact=c.contacts[f.username]):f.exists=!1,f.redirect()}),this.toggleContact=function(a){a?this.addContact(f.username):this.removeContact(f.username)},this.addContact=function(a){c.contacts[a]=!0,c.contacts.$save().then(function(){},function(){})},this.removeContact=function(a){if(c.contacts[a]){var b=e(c.contactsRef.child(a));b.$remove().then(function(){},function(){})}},this.redirect=function(){(c.username===this.username||c.name&&f.details&&c.name===f.details.name)&&(a.backing=!0,b.changeState("account")),f.loading=!1}}]),angular.module("eventPlannerApp").controller("UserPreviewCtrl",["$scope",function(a){this.details=a.userData,this.username=a.username}]);