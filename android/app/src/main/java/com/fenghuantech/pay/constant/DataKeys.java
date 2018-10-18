package com.fenghuantech.pay.constant;

/**
 * Created by lhk on 2018/3/23.
 */

public class DataKeys {
    public static class Common {
        public static final String ADDON = "addon";
    }
    public static class UserInfo {
       public static final String TOKEN = "token";
    }

    public static class IdCardInfo {
        public static final String CARD_NO = "cardNo";
        public static final String CARD_NAME = "cardName";
    }

    public static class Certificate {
        public static final String STATUS = "status";
    }

    public static class PayInfo {
        public static final String TYPE = "type";
        public static final String CARD_ID = "cardId";
        public static final String AMOUNT = "amount";
        public static final String ORDER_ID = "orderId";
        public static final String CHANNEL = "channel";
        public static final String BANK_NO = "bankNo";
        public static final String CONSUME_INFO = "consumeInfo";
    }

    public static class MiLian {
        public static final String TUNNEL = "MI_LIAN";
        public static final String CHANNEL = "HUOLONGGUO";
    }

    public static class BankInfo {
        public static final String ID = "bank_id";
        public static final String UNION_NO = "unionNo";
        public static final String NAME = "bank_name";
    }
}
