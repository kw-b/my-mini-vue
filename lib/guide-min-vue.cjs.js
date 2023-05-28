'use strict';

var publicPropertiesMap = {
    $el: function (i) { return i.vNode.el; }
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState;
        if (key in setupState) {
            return setupState[key];
        }
        // key -> $el
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

var createComponentInstance = function (vNode) {
    var component = {
        vNode: vNode,
        type: vNode.type,
        setupState: {}
    };
    return component;
};
var setupComponent = function (instance) {
    //[ ] initProp()
    //[ ] initSlots()
    setupStateFulComponent(instance);
};
function setupStateFulComponent(instance) {
    var component = instance.type;
    var setup = component.setup;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    if (setup) {
        // function object
        var setupResult = setup();
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
    if (typeof vNode.type === "string") {
        processElement(vNode, container);
    }
    else if (typeof vNode.type === "object") {
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
    var children = vNode.children;
    if (typeof children === "string") {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(vNode, el);
    }
    var props = vNode.props;
    for (var key in props) {
        var val = props[key];
        el.setAttribute(key, val);
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
        el: null
    };
    return vNode;
};

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
