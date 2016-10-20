
exports.all = function* () {
    this.body = {
        success: true,
        data: [
            {
                id: 1,
                text: 'Learn antd',
                isComplete: true,
            },
            {
                id: 2,
                text: 'Learn ant-tool',
            },
            {
                id: 3,
                text: 'Learn dora',
            },
        ],
    }
}