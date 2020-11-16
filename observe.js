class Observe {
    constructor() {
        this.cachelist = {}

        this.subscript = function(dataType, callback) {
            if (!this.cachelist[dataType]) {
                this.cachelist[dataType] = []
            }
            this.cachelist[dataType].push(callback)
        }

        this.publish = function(dataType, msg) {
            if (this.cachelist[dataType]) {
                for (let i = 0, len = this.cachelist[dataType].length; i < len; i++) {
                    for (let key in this.cachelist[dataType][i]) {
                        this.cachelist[dataType][i][key](key + ' ' + msg + dataType)
                    }
                }
            }
        }

        this.unsubsript = function(dataType, cb) {
            if (!dataType) {
                this.cachelist = {}
            } else if (dataType && !cb) {
                delete this.cachelist[dataType]
            } else {
                for (let i = 0, len = this.cachelist[dataType].length; i < len; i++) {
                    for (let key in this.cachelist[dataType][i]) {
                        if (key == cb) {
                            this.cachelist[dataType].splice(i, 1)
                        }
                    }
                }
            }
        }
    }
}