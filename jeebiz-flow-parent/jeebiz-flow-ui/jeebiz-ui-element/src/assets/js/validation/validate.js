
function validateYpos(rule, value, callback){
    if (value==='') {
         callback(new Error('必填'));
    }else if (!/^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,5})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,5}|180)$/.test(value)) {
        callback(new Error('请输入正确经度坐标（小数点后保留5位）'));
    } else {
        callback();
    }
}
function validateXpos(rule, value, callback){
    if (value==='') {
         callback(new Error('必填'));
    }else if (!/^(\-|\+)?([0-8]?\d{1}\.\d{0,5}|90\.0{0,5}|[0-8]?\d{1}|90)$/.test(value)) {
        callback(new Error('请输入正确纬度坐标（小数点后保留5位）'));
    } else {
        callback();
    }
}
function validateNum(rule, value, callback){
    if (value&&!/^\d+$/.test(value)) {
        callback(new Error('请输入数字'));
    } else {
        callback();
    }
}
function validateNumber(rule, value, callback){
    if (value==='') {
         callback(new Error('必填'));
    }else if (!/^[2-9]$/.test(value)) {
        callback(new Error('请输入区间范围2-9的数字'));
    } else {
        callback();
    }
}
function validateAccount(rule, value, callback){
    if (value==='') {
         callback(new Error('必填'));
    }else if (!/^[0-9a-zA-Z\u4e00-\u9fa5]{6,20}$/.test(value)) {
        callback(new Error('请输入6-20位数字、字母、汉字'));
    } else {
        callback();
    }
}
function validatePassword(rule,value,callback){
     if (value==='') {
         callback(new Error('必填'));
    }else if (!/^[0-9a-zA-Z@]{6,20}$/.test(value)) {
        callback(new Error('请输入6-20字符，数字、大写字母、小写字母，@组成'));
    }else{
        callback();
    }
}
function validateInstructNum(rule, value, callback){
    if (value&&!/^([1-9][0-9]*|[1-9][0-9]*\.\d{1})$/.test(value)) {
        callback(new Error('请输入数字,有小数保留一位'));
    }else{
        callback();
    }
}
function validateIP(rule, value, callback){
    if (value&&!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/.test(value)) {
        callback(new Error('请输入正确IP地址'));
    }else{
        callback();
    }
}
function validateProjectName(rule, value, callback){
    if (value==='') {
         callback(new Error('必填'));
    }else if (!/^[0-9a-zA-Z\u4e00-\u9fa5_]{1,30}$/.test(value)) {
        callback(new Error('请输入1-30位汉字、字母、数字、下划线'));
    } else {
        callback();
    }
}
function validateUserName(rule, value, callback){
    if (value==='') {
         callback(new Error('必填'));
    }else if (!/^[0-9a-zA-Z_]{3,20}$/.test(value)) {
        callback(new Error('请输入3-20位数字、字母、下划线'));
    } else {
        callback();
    }
}
// 手机号校验
function validatePhone(rule, value, callback, source) {
    if (value === '') {
        callback(new Error('请输入手机号'));
    } else if (value !== '' && !/^(1[0-9]{10})?$/.test(value)) {
        callback(new Error('请输入正确的手机号码格式'));
    } else {
        callback();
    }
}
//联系人非必填
function validateContactPerson(rule, value, callback){
    if (value&&!/^[a-zA-Z\u4e00-\u9fa5]{1,50}$/.test(value)) {
        callback(new Error('请输入1-50位汉字、字母'));
    } else {
        callback();
    }
}
//项目经理 必填
function validatePersonName(rule, value, callback){
    if (value==='') {
         callback(new Error('必填'));
    }else if (!/^[a-zA-Z\u4e00-\u9fa5_]{1,30}$/.test(value)) {
        callback(new Error('请输入1-30位汉字、字母'));
    } else {
        callback();
    }
}
//地址必填
function validateAllAddress(rule, value = '', callback) {
    if (value === '') {
        callback(new Error('必填'));
    } else if (value !== '' && !/^[0-9a-zA-Z\u4e00-\u9fa5\()]{1,100}$/.test(value)) {
        callback(new Error('中文、英文、数字、()组合，100位以内。'));
    } else {
        callback();
    }
}
//电梯层数
function validatelayerNum(rule, value = '', callback) {
    if (value === '') {
        callback(new Error('必填'));
    } else if (value !== '' && !/^(([6-9])|(50))$/.test(value)) {
        callback(new Error('请输入6-50的正整数'));
    } else {
        callback();
    }
}
//电梯站数
function validateDoorNum(rule, value = '', callback) {
    if (value === '') {
        callback(new Error('必填'));
    } else if (value !== '' && !/^(([0-1]*[0-9]|20))$/.test(value)) {
        callback(new Error('请输入1-20的正整数'));
    } else {
        callback();
    }
}
//任意数字必填
function validateAllNum(rule, value = '', callback) {
    if (value === '') {
        callback(new Error('必填'));
    } else if (value !== '' && !/^[0-9]{1,100}$/.test(value)) {
        callback(new Error('请输入任意数字'));
    } else {
        callback();
    }
}
//网关MAC 必填
function validateMac(rule, value, callback){
    if (value==='') {
         callback(new Error('必填'));
    }else if (!/^[0-9a-zA-Z]{12}$/.test(value)) {
        callback(new Error('请输入12位数字和字母'));
    } else {
        callback();
    }
}
//维保工姓名 必填
function validateMaintenanceManName(rule, value, callback){
    if (value==='') {
         callback(new Error('必填'));
    }else if (!/^[0-9a-zA-Z\u4e00-\u9fa5_]{1,20}$/.test(value)) {
        callback(new Error('请输入1-20位汉字、字母、数字组合'));
    } else {
        callback();
    }
}
// 有效期
function validateDateRange(rule, value, callback){
    if (!value[0]) {
         callback(new Error('必选'));
    }else {
        callback();
    }
}
// 有效期
function validateYearNumber(rule, value, callback){
    if (!value[0]) {
         callback(new Error('必选'));
    }else if (!/^\d\d\d\d-\d\d\d\d$/.test(value)) {
        callback(new Error('请输入类似于2019-2020字符的格式'));
    } else {
        callback();
    }
}
module.exports = {
    validateXpos,
    validateYpos,
    validateNum,
    validateNumber,
    validateAccount,
    validatePassword,
    validateInstructNum,
    validateIP,
    validateProjectName,
    validateUserName,
    validatePhone,
    validateContactPerson,
    validatePersonName,
    validateAllAddress,
    validatelayerNum,
    validateDoorNum,
    validateAllNum,
    validateMac,
    validateMaintenanceManName,
    validateDateRange,
    validateYearNumber
};
