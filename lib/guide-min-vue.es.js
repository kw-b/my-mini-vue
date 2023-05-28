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

export { createApp, h };
