local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local Timer = require("libraries.timer")
local ____Group = require("bliss.group.Group")
local Group = ____Group.Group
local ____Signal = require("bliss.util.Signal")
local Signal = ____Signal.Signal
____exports.State = __TS__Class()
local State = ____exports.State
State.name = "State"
__TS__ClassExtends(State, Group)
function State.prototype.____constructor(self)
    Group.prototype.____constructor(self)
    self.timer = Timer(nil)
    self.onOpen = __TS__New(Signal)
    self.onClose = __TS__New(Signal)
end
function State.prototype.enter(self)
end
function State.prototype.exit(self)
end
function State.prototype.update(self, dt)
    Group.prototype.update(self, dt)
    self.timer:update(dt)
end
return ____exports
