import { Base64 } from 'js-base64';

export class StringUtils {
    static EMPTY = "";

    /**
     * Check whether a string is null or empty.
     * @param str value
     * @returns true : if string is null or empty
     */
    static isNullOrEmpty(str) {
        if (str == null || str === this.EMPTY) {
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
        ret = StringUtils.trimR(ret, defaultStr);

        return ret;
    }
}