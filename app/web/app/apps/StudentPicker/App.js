/**

App for randomly choosing a student activated in the system.

*/
define([
	"framework/App",
	"framework/modules/StateApp/Module",
	"framework/modules/common/CommonStateApps",
	"apps/StudentPicker/Module"
],

function (App, StateApp, CommonStateApps, StudentPicker) {

	/**
	 *  StudentPicker App
	 */
	var StudentPickerApp = CommonStateApps.BasicApp.extend({
		id: "StudentPicker",
		version: "1.0",
		States: [ StudentPicker.Grid, StudentPicker.Pick ],
		prepend: { attendance: false }
	});

	// description for use in router
	StudentPickerApp.app = {
		instantiate: function (attrs) {
			return new StudentPickerApp(attrs, { autoAddNew: true, writeLogAtEnd: false });
		},
		AppControlsView: undefined,
		title: "StudentPicker"
	};

	return StudentPickerApp;
});