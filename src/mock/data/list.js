import Mock from 'mockjs';

const List = []

for (let i = 0; i < 3; i++) {
  List.push(Mock.mock({
    label: '主栏目' + (i + 1),
    pid: 0,
    id: i + 1,
    children: [{
      id: 10 * (i + 1),
      label: '二级栏目' + (10 * (i + 1) + 1),
      pid: i + 1,
      children: []
    }]
  }))

}
export { List };
