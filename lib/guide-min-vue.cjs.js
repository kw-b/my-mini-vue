'use strict';

var createComponentInstance = function (vNode) {
    var component = {
        vNode: vNode,
        type: vNode.type,
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
    patch(vNode);
};
function patch(vNode, container) {
    // 去处理组件
    // [ ] 判断 vNode 是不是一个 element
    processComponent(vNode);
}
function processComponent(vNode, container) {
    mountComponent(vNode);
}
function mountComponent(vNode, container) {
    var instance = createComponentInstance(vNode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    var subTree = instance.render();
    // vNode -> patch
    // vNode -> element -> mountElement
    patch(subTree);
}

var createVNode = function (type, props, children) {
    var vNode = {
        type: type,
        props: props,
        children: children
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
            render(vNode);
        },
    };
};

var h = function (type, props, children) {
    return createVNode(type, props, children);
};

exports.createApp = createApp;
exports.h = h;
