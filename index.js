var
// depedencies
    Cookies = require("cookie"),
    _ = require("underscore"),
    // depends on having rendr installed
    baseModel = require("../rendr/shared/base/view");

module.exports = function (app) {

    var component = {};

    // get the cookies by name, first param is the name of the cookie
    // this should be a string

    component.get = function (name) {

        var
            cookies = this.getAll.call(this) || {},
            pattern = new RegExp(name),
            value;

        for (var key in cookies) {
            if (key === name) {
                value = decodeURIComponent(cookies[key]);
            }
        }

        return value;

    }

    // set the cookie is the a way to set a cookie the frist param
    // is the cookie name and the soecond is the payload to be set
    // for the cookies data can be a string or an object

    component.set = function (name, value, opts) {
        if (typeof document === "object") {
            var cookies = Cookies.serialize(name, value, opts);
            document.cookie = cookies;

        } else if (typeof app.req === "object") {
            app.req.setResponseCookie(name, value, opts);
            // do server stuff
        }
    }

    component.getAll = function () {
        if (typeof document === "object") {
            return Cookies.parse(document.cookie);
        } else {
            if (typeof app.req.headers.cookie === "string") {
                return Cookies.parse(app.req.headers.cookie);
            }
        }

        return null;

    };

    component.remove = function (name) {
        if (typeof document === "object") {
            this.set(name, 'loggedout', {
                'expires': new Date(-1)
            })
        } else {
            app.req.removeResponseCookie(name);
        }
    }

    return component;

};