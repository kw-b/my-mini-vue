'use strict';

var initProps = function (instance, rawProps) {
    instance.props = rawProps || {};
};

var extend = Object.assign;
var isObject = function (val) {
    return val !== null && typeof val == "object";
};
var hasOwn = function (val, key) {
    return Object.prototype.hasOwnProperty.call(val, key);
};
var camelize = function (str) {
    return str.replace(/-(\w)/g, function (_, c) {
        return c ? c.toUpperCase() : "";
    });
};
var capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
var toHandlerKey = function (str) {
    return str ? "on".concat(capitalize(str)) : "";
};

var publicPropertiesMap = {
    $el: function (i) { return i.vNode.el; }
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState, props = instance.props;
        // if(key in setupState){
        //   return setupState[key]
        // }
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        // key -> $el
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

var targetMap = new Map();
var trigger = function (target, key) {
    var depsMap = targetMap.get(target);
    var dep = depsMap.get(key);
    triggerEffects(dep);
};
var triggerEffects = function (dep) {
    for (var _i = 0, dep_1 = dep; _i < dep_1.length; _i++) {
        var effect_1 = dep_1[_i];
        if (effect_1.scheduler) {
            effect_1.scheduler();
        }
        else {
            effect_1.run();
        }
    }
};

var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly, shallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (shallow === void 0) { shallow = false; }
    return function (target, key) {
        var res = Reflect.get(target, key);
        if (key === "__v_isReactive" /* ReactiveFlag.IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v-isReadonly" /* ReactiveFlag.IS_READONLY */) {
            return isReadonly;
        }
        if (shallow) {
            return res;
        }
        // 看看 res 是不是 object
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function (target, key, value) {
        var res = Reflect.set(target, key, value);
        // [x] 触发依赖
        trigger(target, key);
        return res;
    };
}
var mutableHandlers = {
    get: get,
    set: set,
};
var readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key, value) {
        console.warn("key:".concat(key, " set \u5931\u8D25, \u56E0\u4E3A target \u662F readonly"), target);
        return true;
    },
};
var shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
});

var reactive = function (raw) { return createActiveObject(raw, mutableHandlers); };
var readonly = function (raw) { return createActiveObject(raw, readonlyHandlers); };
var shallowReadonly = function (raw) {
    return createActiveObject(raw, shallowReadonlyHandlers);
};
function createActiveObject(raw, baseHandlers) {
    if (!isObject(raw)) {
        console.warn("target".concat(raw, "\u5FC5\u987B\u662F\u4E00\u4E2A\u5BF9\u8C61"));
        return raw;
    }
    return new Proxy(raw, baseHandlers);
}

var emit = function (instance, event) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    console.log("emit:", event);
    // instance.props -> event
    var props = instance.props;
    // TPP
    // 先去写一个特定的行为 -> 重构成通用的行为
    // add -> Add
    // add-foo -> addFoo
    var handlerName = toHandlerKey(camelize(event));
    var handler = props[handlerName];
    handler && handler.apply(void 0, args);
};

var createComponentInstance = function (vNode) {
    var component = {
        vNode: vNode,
        type: vNode.type,
        setupState: {},
        props: {},
        emit: function () { }
    };
    component.emit = emit.bind(null, component);
    return component;
};
var setupComponent = function (instance) {
    // [x]
    initProps(instance, instance.vNode.props);
    //[ ] initSlots()
    setupStateFulComponent(instance);
};
function setupStateFulComponent(instance) {
    var component = instance.type;
    var setup = component.setup;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    if (setup) {
        // function object
        var setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var component = instance.type;
    instance.render = component.render;
}

var render = function (vNode, container) {
    // 调用 patch 递归处理
    patch(vNode, container);
};
function patch(vNode, container) {
    // 去处理组件
    // [x] 判断 vNode 是不是一个 element
    var shapeFlag = vNode.shapeFlag;
    if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
        processElement(vNode, container);
    }
    else if (shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        processComponent(vNode, container);
    }
}
function processElement(vNode, container) {
    // init -> update
    mountElement(vNode, container);
}
function mountElement(vNode, container) {
    var el = (vNode.el = document.createElement(vNode.type));
    // string array
    var children = vNode.children, shapeFlag = vNode.shapeFlag;
    if (shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
        mountChildren(vNode, el);
    }
    var props = vNode.props;
    for (var key in props) {
        var val = props[key];
        // 具体的 click -> 通用
        // on + Event name
        // onMousedown
        var isOn = function (key) { return /^on[A-Z]/.test(key); };
        if (isOn(key)) {
            var event_1 = key.slice(2).toLowerCase();
            el.addEventListener(event_1, val);
        }
        else {
            el.setAttribute(key, val);
        }
    }
    container.append(el);
}
function mountChildren(vNode, container) {
    vNode.children.forEach(function (v) {
        patch(v, container);
    });
}
function processComponent(vNode, container) {
    mountComponent(vNode, container);
}
function mountComponent(initialVNode, container) {
    var instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    var proxy = instance.proxy;
    var subTree = instance.render.call(proxy);
    // vNode -> patch
    // vNode -> element -> mountElement
    patch(subTree, container);
    // element -> mount
    initialVNode.el = subTree.el;
}

var createVNode = function (type, props, children) {
    var vNode = {
        type: type,
        props: props,
        children: children,
        shapeFlag: getShapeFlag(type),
        el: null
    };
    if (typeof children === 'string') {
        vNode.shapeFlag |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vNode.shapeFlag |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    return vNode;
};
function getShapeFlag(type) {
    return typeof type === 'string' ? 1 /* ShapeFlags.ELEMENT */ : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

var createApp = function (rootComponent) {
    return {
        mount: function (rootContainer) {
            // 先转换为虚拟节点(vNode)
            // component -> vNode
            // 所有的操作逻辑 都会基于 vNode 做处理
            var vNode = createVNode(rootComponent);
            render(vNode, rootContainer);
        },
    };
};

var h = function (type, props, children) {
    return createVNode(type, props, children);
};

exports.createApp = createApp;
exports.h = h;
