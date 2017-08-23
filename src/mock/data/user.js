import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    level: '4',
    uname: '张某某',
    sex: 1
  }
];

const Users = [];
const Duties = [{
  id: 90,
  duties: [{title:'web前端', value: 1}, {title:'php后端', value: 2}]
}]


Mock.Random.extend({
    duty: function(date) {
        var dutys = ['web前端', 'php后端']
        return this.pick(dutys)
    }
})

for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    imgpath: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
    uname: Mock.Random.cname(),
    upass: 123456,
    sex: Mock.Random.integer(0, 1),
    mobile: /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/,
    duty: '@DUTY',
    status: 1,
    birth: '1994-3-15',
    id: i+1
  }));
}

export { LoginUsers, Users, Duties };
