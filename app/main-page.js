"use strict";
var main_view_model_1 = require('./main-view-model');
function onNavigatingTo(args) {
    var page = args.object;
    page.bindingContext = new main_view_model_1.MainViewModel(page);
}
exports.onNavigatingTo = onNavigatingTo;
//# sourceMappingURL=main-page.js.map