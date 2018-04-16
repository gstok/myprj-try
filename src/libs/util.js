let util = {

};
util.title = function (title) {
    title = title ? title : '数据客';
    window.document.title = title;
};

export default util;