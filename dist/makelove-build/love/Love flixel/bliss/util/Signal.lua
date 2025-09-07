local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__ArrayFilter = ____lualib.__TS__ArrayFilter
local ____exports = {}
local Subscription = __TS__Class()
Subscription.name = "Subscription"
function Subscription.prototype.____constructor(self, event, callback)
    self.event = event
    self.callback = callback
end
function Subscription.prototype.disconnect(self)
    self.event:disconnect(self)
end
function Subscription.prototype.emit(self, payload)
    self:callback(payload)
end
____exports.Signal = __TS__Class()
local Signal = ____exports.Signal
Signal.name = "Signal"
function Signal.prototype.____constructor(self)
    self.subscriptions = {}
end
function Signal.prototype.connect(self, callback)
    local subscription = __TS__New(Subscription, self, callback)
    local ____self_subscriptions_0 = self.subscriptions
    ____self_subscriptions_0[#____self_subscriptions_0 + 1] = subscription
end
function Signal.prototype.disconnect(self, subscription)
    self.subscriptions = __TS__ArrayFilter(
        self.subscriptions,
        function(____, x) return x ~= subscription end
    )
end
function Signal.prototype.clear(self)
    self.subscriptions = {}
end
function Signal.prototype.emit(self, payload)
    local subscriptions = {unpack(self.subscriptions)}
    for ____, subscription in ipairs(subscriptions) do
        subscription:emit(payload)
    end
end
return ____exports
