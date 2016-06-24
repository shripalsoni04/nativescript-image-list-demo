"use strict";
var observable_1 = require('data/observable');
var image_cache_1 = require('ui/image-cache');
var image_source_1 = require('image-source');
//some comment
var cache = new image_cache_1.Cache();
cache.maxRequests = 10;
cache.placeholder = image_source_1.fromFile('~/images/placeholder-img.jpg');
cache.clear();
var ImageItem = (function (_super) {
    __extends(ImageItem, _super);
    function ImageItem(oImg) {
        _super.call(this);
        this._oImg = oImg;
    }
    Object.defineProperty(ImageItem.prototype, "imageSource", {
        get: function () {
            var _this = this;
            var image = cache.get(this._oImg.url);
            if (image) {
                return image;
            }
            cache.push({
                url: this._oImg.url,
                key: this._oImg.url,
                completed: function (image) {
                    if (image) {
                        _this.notifyPropertyChange('imageSource', image);
                    }
                }
            });
            var scaledPlaceholderImageSrc;
            if (cache.placeholder.android) {
                var resizedBitmap = android.graphics.Bitmap.createScaledBitmap(cache.placeholder.android, this._oImg.width, this._oImg.height, true);
                scaledPlaceholderImageSrc = resizedBitmap;
            }
            if (cache.placeholder.ios) {
                var cgSize = CGSizeMake(this._oImg.width, this._oImg.height);
                UIGraphicsBeginImageContextWithOptions(cgSize, false, 0.0);
                cache.placeholder.ios.drawInRect(CGRectMake(0, 0, this._oImg.width, this._oImg.height));
                var newImageSource = UIGraphicsGetImageFromCurrentImageContext();
                UIGraphicsEndImageContext();
                scaledPlaceholderImageSrc = newImageSource;
            }
            var newImg = new image_source_1.ImageSource();
            newImg.setNativeSource(scaledPlaceholderImageSrc);
            return newImg;
        },
        enumerable: true,
        configurable: true
    });
    return ImageItem;
}(observable_1.Observable));
var MainViewModel = (function (_super) {
    __extends(MainViewModel, _super);
    function MainViewModel(_page) {
        _super.call(this);
        this._page = _page;
        this.init();
    }
    Object.defineProperty(MainViewModel.prototype, "images", {
        get: function () {
            return this._images;
        },
        set: function (images) {
            this._images = images;
            this.notifyPropertyChange('images', images);
        },
        enumerable: true,
        configurable: true
    });
    MainViewModel.prototype._getObservableImage = function (lstImages) {
        var array = [];
        lstImages.forEach(function (oImg) {
            array.push(new ImageItem(oImg));
        });
        return array;
    };
    MainViewModel.prototype.init = function () {
        var imgUrls = [
            {
                url: "http://shripalsoni.com/wp-content/uploads/2016/06/image1_421_720.jpg",
                width: 421,
                height: 720
            },
            {
                url: "http://shripalsoni.com/wp-content/uploads/2016/06/image2_960_638.jpg",
                width: 960,
                height: 638
            },
            {
                url: "http://shripalsoni.com/wp-content/uploads/2016/06/image3_720_720.jpg",
                width: 720,
                height: 720
            },
            {
                url: "http://shripalsoni.com/wp-content/uploads/2016/06/image4_960_638.jpg",
                width: 960,
                height: 638
            },
            {
                url: "http://shripalsoni.com/wp-content/uploads/2016/06/image5_960_640.jpg",
                width: 960,
                height: 640
            },
            {
                url: "http://shripalsoni.com/wp-content/uploads/2016/06/image6_960_720.jpg",
                width: 960,
                height: 720
            },
            {
                url: "http://shripalsoni.com/wp-content/uploads/2016/06/image7_960_540.jpg",
                width: 960,
                height: 540
            }
        ];
        this.images = this._getObservableImage(imgUrls);
    };
    return MainViewModel;
}(observable_1.Observable));
exports.MainViewModel = MainViewModel;
//# sourceMappingURL=main-view-model.js.map