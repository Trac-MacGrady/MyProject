import Host from "../conf/Config";
import HttpClient from "../network/HttpClient";

export default function VerifyCard(cardNo, callback) {
    let data = {
        "_input_charset": "utf-8",
        "cardNo": cardNo,
        "cardBinCheck": true
    };
    let url = Host.verifyCard;
    HttpClient.doGenericPost(url, data, callback);

}