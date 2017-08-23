import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { LoginUsers, Users, Duties } from './data/user';
import { List } from './data/list'
import { proNav, proList } from './data/pro'
let _List = List
let _ProList = proList
let _Users = Users;
let _Duties = Duties

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios);

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });

    //登录
    mock.onPost('/User/login').reply(config => {
      let username = config.data.split('&')[0].split('=')[1],
          password = config.data.split('&')[1].split('=')[1]
      return new Promise((resolve, reject) => {
        let info = null;
        setTimeout(() => {
          let hasUser = LoginUsers.some(u => {
            if (u.username === username && u.password === password) {
              info = JSON.parse(JSON.stringify(u));
              info.password = undefined;
              return true;
            }
          }
        );

          if (hasUser) {
            resolve([200, { code: 200, msg: '请求成功', info }]);
          } else {
            resolve([200, { code: 500, msg: '账号或密码错误'}]);
          }
        }, 1000);
      });
    });

    //获取用户列表
    mock.onGet('/user/list').reply(config => {
      let {name} = config.params;
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    mock.onGet('Catg/query').reply(config => {
      let id = config.params
      if (id == 90) {
        let duties = _Duties[0].duties
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve([200, {
              duties
            }]);
          }, 100);
        });
      }
    })


    //获取用户列表（分页）
    mock.onGet('/User/index').reply(config => {
      let {page, name} = config.params;
      let mockUsers = _Users.filter(user => {
        if (name && user.uname.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockUsers.length;
      mockUsers = mockUsers.filter((u, index) => index < 15 * page && index >= 15 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //删除用户
    mock.onGet('/User/remove').reply(config => {
      let { id } = config.params;
      _Users = _Users.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //批量删除用户
    mock.onGet('/user/batchremove').reply(config => {
      let { ids } = config.params;
      ids = ids.split(',');
      _Users = _Users.filter(u => !ids.includes(u.id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //编辑用户
    mock.onPost('/User/edit').reply(config => {
      let { id, name, addr, age, birth, sex } = config.params;
      _Users.some(u => {
        if (u.id === id) {
          u.name = name;
          u.addr = addr;
          u.age = age;
          u.birth = birth;
          u.sex = sex;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });


    //新增用户
    mock.onGet('/user/add').reply(config => {
      let { name, addr, age, birth, sex } = config.params;
      _Users.push({
        name: name,
        addr: addr,
        age: age,
        birth: birth,
        sex: sex
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });


    //获取Catg
    mock.onGet('/Catg/index').reply(config => {
      let list = _List
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            list
          }]);
        }, 1000);
      })
    });


    // 编辑Catg

    mock.onGet('/Catg/edit').reply(config => {
      let { value, id } = config.params;
      _List.some(u => {
        if (u.id === id) {
          u.label = value
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });

    // 添加Catg
    mock.onGet('/Catg/add').reply(config => {
      let { id, value } = config.params;
      _That[id].children.push({
        id: id * 100,
        label: value,
        children: []
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });


    // 获取产品列表导航

    mock.onGet('/Pro/proNav').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            nav: proNav
          }]);
        }, 300);
      });
    });

    //  获取产品列表

    mock.onGet('/Pro/proList').reply(config => {
      let {p2} = config.params;
      let mockPro = _ProList.filter(pros => {
        // if (name && user.name.indexOf(name) == -1) return false;
        if (pros.p2 == p2) return true;
        // return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pros: mockPro
          }]);
        }, 1000);
      });
    });
  }
};
