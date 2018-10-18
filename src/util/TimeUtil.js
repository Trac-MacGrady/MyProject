
export default class TimeUtil{
    static formatTime(time){
        let yyyy = time.substring(0, 4);
        let MM = time.substring(4, 6);
        let dd = time.substring(6, 8);
        let HH = time.substring(8, 10);
        let mm = time.substring(10, 12);
        let ss = time.substring(12, 14);
        return yyyy + "-" + MM + "-" + dd + " " + HH + ":" + mm + ":" + ss;
    }
}