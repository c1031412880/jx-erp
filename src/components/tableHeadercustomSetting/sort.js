/**
 * 根据数组的对象id对数组重新排序（id可大到小， 小到大）
 */
 export const handleFloor = (arr) => {
  if (arr) {
    let result = [],
      arr1 = [];

    result = arr.filter(function(element, index, self) {
      return self.findIndex((el) => el.id == element.id) === index;
    });
    for (let i = 0; i < result.length; i++) {
      arr1.push(result[i].id);
    }

    // 排序 b-a 由大到小; a-b 由小到大
    var cur = arr1.sort((a, b) => {
      return a - b;
    });

    var push = [];
    for (let item in result) {
      if (in_array(result[item].id, cur)) {
        result[item]["sort"] = cur.indexOf(result[item].id);
        push.push(result[item]);
      }
    }
    push = push.sort(function(a, b) {
      if (a.sort < b.sort) {
        return -1;
      } else if (a.sort > b.sort) {
        return 1;
      }
      return 0;
    });
    
    function in_array(key, array) {
      for (var i in array) {
        if (array[i] == key) {
          return true;
        }
      }
      return false;
    }
    return push;
  }
};
