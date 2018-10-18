import React from 'react-native';

class ArrayUtil{

    static getLength(o){
        let t = typeof o;

        if(t === 'string'){
            return o.length;

        }else if(t === 'object'){

            let n = 0;

            for(let i in o){
                n++;
            }
            return n;
        }
        return false;

    }
}

export default ArrayUtil;