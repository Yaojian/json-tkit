import * as jsonx from "./json-serialization-helper";
import {assert} from "chai";

describe("json-serialization-helper suite", function () {
    describe("serialize", function () {
        it("returns JSON when object has no circular references", function () {
            let obj = {value: "hello"};
            let text = jsonx.stringify(obj);
            //console.log(text);
            assert.equal(`{"value":"hello"}`, text);
        });
        it ("returns JSON when object has circular references", function () {
            let obj: {value: any} = {value: null};
            obj.value = obj;
            let text = jsonx.stringify(obj);
            //console.log(text);
            assert.equal(`{"value":{"$ref":"$"}}`, text);
        });
        it("returns `{}` when object has no property", function () {
            let obj = {};
            let text = jsonx.stringify(obj);
            //console.log(text);
            assert.equal(`{}`, text);
        });
        it("returns `null` when object is null", function () {
            let obj: Object = null;
            let text = jsonx.stringify(obj);
            assert.equal(`null`, text);
        });
    });
    describe("deserialize", function () {
        it("returns null when JSON is `null`", function () {
            let text = "null";
            let obj = jsonx.parse(text);
            //console.log(obj);
            assert.equal(null, obj);
        });
        it("returns empty object when JSON is `{}`", function () {
            let text = "{}";
            let obj = jsonx.parse(text);
            assert.deepEqual({}, obj);
        });
        it("returns object when JSON has `$href`", function () {
            let text = '{"o":{"$ref":"$"}}';
            let obj = jsonx.parse(text);
            assert.isTrue(obj === obj.o);
        });
    });
});