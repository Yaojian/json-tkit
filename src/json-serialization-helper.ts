
export type TReplacer = (obj: any) => any;

class Cache extends WeakMap<Object, string> {

}

export function stringify(obj: any, replacer ?: TReplacer): string {
    let decycled = decycle(obj, replacer);
    return JSON.stringify(decycled)
}

/** Replace property values which are circular object references with its string representation */
export function decycle(obj: any, replacer?: TReplacer) {
    "use strict";
    if (replacer && !(replacer instanceof Function)) throw Error("Invalid argument 'replacer', it should be a function or null.");

    let cache = new Cache();
    //return internalDecycle(cache, obj, "$", replacer);


    function internalDecycle(value: any, path: string): any {
        if (typeof value === "object" && value !== null && isPrimitiveWrapper(value) === false) {
            if (replacer) replacer(value);

            let cachedPath = cache.get(value);
            if (cachedPath !== undefined) {
                return {$ref: cachedPath};
            }

            //Caches obj and it's path
            cache.set(value, path);

            if (Array.isArray(value)) {
                //  decycles each element
                let decycled: Array<any> = [];
                value.forEach(function (element: any, index: number) {
                    decycled[index] = internalDecycle(element, `${path}[${index}]`);
                });
                return decycled;
            } else {
                //  decycles each property value
                let decycled: any = {};
                Object.keys(value).forEach(function (name) {
                    decycled[name] = internalDecycle(value[name], `${path}[${name}]`);
                });
                return decycled;
            }
        }
        return value;
    }

    let result = internalDecycle(obj, "$");
    return result;
}

export function parse(jsonText: string) {
    let jsonObject = JSON.parse(jsonText);
    return retrocycle(jsonObject);
}


/** The regular expression for testing if the property value is a circular object reference. */
const cycleMatcher : RegExp = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\([\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;

export function retrocycle($: any) {
    "use strict";

    function internalRetrocycle(obj: any): void {
        if (obj && typeof obj === "object") {
            if (Array.isArray(obj)) {
                //  process each element
                obj.forEach(function (element: any, index: number) {
                    if (typeof element === "object" && element !== null) {
                        let path = element.$ref;
                        if (typeof path === "string" && cycleMatcher.test(path)) {
                            obj[index] = eval(path);
                        } else {
                            internalRetrocycle(element);
                        }
                    }
                });
            } else {
                Object.keys(obj).forEach(function (name: string) {
                    let prop = obj[name];
                    if (typeof prop === "object" && prop !== null) {
                        let path = prop.$ref;
                        if (typeof path === "string" && cycleMatcher.test(path)) {
                            obj[name] = eval(path);
                        } else {
                            internalRetrocycle(prop);
                        }
                    }
                });
            }
        }
    }

    internalRetrocycle($);
    return $;
}

/** Returns if `obj` is of an wrapper of simple type. */
function isPrimitiveWrapper(obj: any) {
    return (obj instanceof Boolean)
        || (obj instanceof Date)
        || (obj instanceof Number)
        || (obj instanceof RegExp)
        || (obj instanceof String);
}