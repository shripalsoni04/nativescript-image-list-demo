import {Observable} from 'data/observable';
import {Cache} from 'ui/image-cache';
import {fromFile, ImageSource} from 'image-source';
import {Page} from 'ui/page';
import {ListView} from 'ui/list-view';
import {Image} from 'ui/image';

declare var UIImage: any;
declare var UIGraphicsBeginImageContextWithOptions: any;
declare var CGSizeMake: any;
declare var CGRectMake: any;
declare var UIGraphicsGetImageFromCurrentImageContext: any;
declare var UIGraphicsEndImageContext: any;

declare var android: any;

//some comment
var cache = new Cache();
cache.maxRequests = 10;
cache.placeholder = fromFile('~/images/placeholder-img.jpg');
cache.clear();
class ImageItem extends Observable{
    private _oImg: any;

    constructor(oImg){
        super();
        this._oImg = oImg;
    }

    get imageSource(){
        var image = cache.get(this._oImg.url);
        if(image){
            return image;
        }

        cache.push({
            url: this._oImg.url,
            key: this._oImg.url,
            completed: (image)=>{
                if(image){
                    this.notifyPropertyChange('imageSource', image);
                }   
            }
        });

        var scaledPlaceholderImageSrc;
        if(cache.placeholder.android){
            var resizedBitmap = android.graphics.Bitmap.createScaledBitmap(cache.placeholder.android, this._oImg.width, this._oImg.height, true);
            scaledPlaceholderImageSrc = resizedBitmap;
        }

        if(cache.placeholder.ios){
            let cgSize = CGSizeMake(this._oImg.width, this._oImg.height);
            UIGraphicsBeginImageContextWithOptions(cgSize, false, 0.0);

            cache.placeholder.ios.drawInRect(CGRectMake(0, 0, this._oImg.width, this._oImg.height));
            let newImageSource = UIGraphicsGetImageFromCurrentImageContext();
            UIGraphicsEndImageContext();
            scaledPlaceholderImageSrc = newImageSource;
        }

        var newImg = new ImageSource();
        newImg.setNativeSource(scaledPlaceholderImageSrc);
        return newImg;
    }
}

export class MainViewModel extends Observable{

    private _images: ImageItem[];

    get images(){
        return this._images;
    }

    set images(images){
        this._images = images;
        this.notifyPropertyChange('images', images);
    }

    constructor(private _page: Page){
        super();
        this.init();
    }

    private _getObservableImage(lstImages){
        var array = [];
        lstImages.forEach((oImg) => {
            array.push(new ImageItem(oImg));
        });
        return array;
    }

    init(){
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

    }
}