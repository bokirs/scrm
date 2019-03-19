// 格式化部门数据
export const formatDepartmentList = (DATA) => {
    if (!(DATA instanceof Array) || !DATA.length) {
        return;
    }
    const dataMap = [],
          newData = [];

    DATA.forEach(item => {
        if (dataMap.indexOf(item.Item3) == -1) {
            dataMap.push(item.Item3);
            const groupData = {
                DId: item.Item3,
                groupName: item.Item4,
                personnels: []
            };
            groupData.personnels.push({
                UId: item.Item1,
                UName: item.Item2
            });
            newData.push(groupData);
        } else {
            newData.forEach(group => {
                if (group.DId === item.Item3) {
                group.personnels.push({
                    UId: item.Item1,
                    UName: item.Item2
                });
                }
            });
        }
    });
    return newData;
}