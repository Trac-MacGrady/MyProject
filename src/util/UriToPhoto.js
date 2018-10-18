import Photo from '../model/Photo';

export default function UriToPhoto(uri, name){
        let splitStr = uri.split("/");
        let type = 'image/jpg';
        let filename = splitStr.pop();
        return new Photo(uri, type, name, filename);
}