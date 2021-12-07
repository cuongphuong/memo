import { Base64 } from 'js-base64';

export class StringUtils {
    static EMPTY = "";

    /**
     * Check whether a string is null or empty.
     * @param str value
     * @returns true : if string is null or empty
     */
    static isNullOrEmpty(str) {
        if (str == null || str === StringUtils.EMPTY) {
            return true;
        }
        return false;
    }

    /**
     * Encoding str to Base64
     * @param str value
     * @returns Base64 str
     */
    static base64Encode(str) {
        if (str === null) {
            return null;
        } else {
            return Base64.encode(str);
        }
    }

    /**
     * Decode Base64 to str
     * @param Base64 str
     * @returns Value decode
     */
    static base64decode(str) {
        if (str === null) {
            return null;
        } else {
            return Base64.decode(str);
        }
    }



    /**
     * Removes " ", "　", and \t from the beginning of the 'str'. Returns 'defaultStr' if 'str' is null
     * or trimmed string is "".
     *
     * @param str
     * @param defaultStr
     * @return trimmed string
     */
    static trimL(str, defaultStr) {

        let ret = str;

        if (ret == null) {
            ret = "";
        }
        // remove ' ', '　', '\t'
        while (ret.startsWith(" ") || ret.startsWith("　") || ret.startsWith("\t") || ret.startsWith("\n")) {
            ret = ret.substring(1);
        }

        if (ret === "") {
            ret = defaultStr;
        }
        return ret;
    }

    /**
     * Removes " ", "　", and \t from the end of the 'str'. Returns 'defaultStr' if 'str' is null or
     * trimmed string is "".
     *
     * @param str
     * @param defaultStr
     * @return trimmed string
     */
    static trimR(str, defaultStr) {

        let ret = str;

        if (ret == null) {
            ret = "";
        }
        // Delete " ", "　", and \t
        while (ret.endsWith(" ") || ret.endsWith("　") || ret.endsWith("\t")) {
            ret = ret.substring(0, ret.length() - 1);
        }

        if (ret === "") {
            ret = defaultStr;
        }
        return ret;
    }

    /**
     * Removes " ", "　", and \t from both ends of the 'str'. Returns 'defaultStr' if 'str' is null or
     * trimmed string is "".
     *
     * @param str
     * @param defaultStr
     * @return trimmed string
     */
    static trim(str, defaultStr) {

        let ret = str;
        // Delete " ", "　", and \t
        ret = StringUtils.trimL(ret, defaultStr);
        //ret = StringUtils.trimR(ret, defaultStr);

        return ret;
    }

    static nonAccentVietnamese(str) {
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        str = str.replace(/\s/g, "-");
        return str;
    }
}