import Mock from 'mockjs'

const proNav = [
  {
    p1: '1',
    name1: '家具',
    selected: '',
    options: [
      {p2: '11', name2: 'HC28'},
      {p2: '12', name2: '比安居'},
      {p2: '13', name2: '家博邸'},
      {p2: '14', name2: '锐驰'},
      {p2: '15', name2: '台森'},
      {p2: '16', name2: '巴尔德'},
      {p2: '17', name2: '续集'},
      {p2: '18', name2: '诺高'},
      {p2: '19', name2: '皇家爱菲'},
      {p2: '110', name2: '美林格'}
    ]
  },
  {
    p1: '2',
    name1: '灯具',
    selected: '',
    options: [
      {p2: '21', name2: '环球灯具'},
      {p2: '22', name2: '马斯登'},
      {p2: '23', name2: '千丽灯具'},
      {p2: '24', name2: '现代灯具'},
      {p2: '25', name2: '美式灯具'},
      {p2: '26', name2: '中式灯具'}
    ]
  },
  {
    p1: '3',
    name1: '配饰',
    selected: '',
    options: [
      {p2: '31', name2: '地毯'},
      {p2: '32', name2: '电器'},
      {p2: '33', name2: '服饰'},
      {p2: '34', name2: '食品'},
      {p2: '35', name2: '寝具'},
      {p2: '36', name2: '玩具'}
    ]
  }
]
const proList = []
// const proList = [
//   {
//     {model: 'HC28_MAT',submodel:'test1', brand:'HC28', price: '8888', uptime: '2017-01-01 12：00' , p2: '11'},
//     {model: 'HC28_MAT',submodel:'test2', brand:'HC28', price: '8888', uptime: '2017-01-01 12：00' , p2: '11'}
//   }
// ]


export { proNav, proList };
