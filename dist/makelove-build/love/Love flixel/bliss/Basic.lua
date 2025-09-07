local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
____exports.Basic = __TS__Class()
local Basic = ____exports.Basic
Basic.name = "Basic"
function Basic.prototype.____constructor(self)
    self.visible = true
    self.active = true
    self.dead = false
    local ____exports_Basic_2, ____idEnumerator_3 = ____exports.Basic, "idEnumerator"
    local ____exports_Basic_idEnumerator_4 = ____exports_Basic_2[____idEnumerator_3]
    ____exports_Basic_2[____idEnumerator_3] = ____exports_Basic_idEnumerator_4 + 1
    self.id = ____exports_Basic_idEnumerator_4
    local ____exports_Basic_0, ____count_1 = ____exports.Basic, "count"
    ____exports_Basic_0[____count_1] = ____exports_Basic_0[____count_1] + 1
end
function Basic.prototype.update(self, dt)
end
function Basic.prototype.render(self)
end
function Basic.prototype.kill(self)
    self.dead = true
    self.active = false
    self.visible = false
end
function Basic.prototype.destroy(self)
    self.dead = true
    self.active = false
    self.visible = false
    local ____exports_Basic_5, ____count_6 = ____exports.Basic, "count"
    ____exports_Basic_5[____count_6] = ____exports_Basic_5[____count_6] - 1
end
Basic.count = 0
Basic.idEnumerator = 0
return ____exports
