// 是否具有该線
export function hasLine(data, from, to) {
    for (let i = 0; i < data.lineList.length; i++) {
        let line = data.lineList[i]
        if (line.from === from && line.to === to) {
            return true
        }
    }
    return false
}

// 是否含有相反的線
export function hashOppositeLine(data, from, to) {
    return hasLine(data, to, from)
}

// 獲取連線
export function getConnector(jsp, from, to) {
    let connection = jsp.getConnections({
        source: from,
        target: to
    })[0]
    return connection
}

// 獲取唯一標識
export function uuid() {
    return Math.random().toString(36).substr(3, 10)
}
