const DATABASE_NAME = "erp_db";
const VERSION = 1;
const TABLE = "erp_table";

/**
 * 获取数据库对象
 */
var request;
var db;
export function getDB() {
  return new Promise(function(resolve, reject) {
    request = window.indexedDB.open(DATABASE_NAME, VERSION);
    request.onsuccess = function(e) {
      db = e.target.result;
      resolve(db);
    };
    request.onupgradeneeded = function(e) {
      // 初始化数据库
      db = e.target.result;
      if (!db.objectStoreNames.contains(TABLE)) {
        // var objectStore = db.createObjectStore(TABLE, {autoIncrement: true});
        var objectStore = db.createObjectStore(TABLE, { keyPath: "name" });
        // 创建索引
        objectStore.createIndex("name", "name", { unique: true });
        objectStore.createIndex("value", "value", { unique: true });
      }
    };
  });
}

/**
 * 在 [db]--[tableName]中新增一条记录[data]
 */
export function addRecord(name, data) {
  return new Promise(function(resolve, reject) {
    let obj = {
      name: name,
      value: data
    };
    let request = db
      .transaction(TABLE, "readwrite")
      .objectStore(TABLE)
      .add(obj);
    request.onsuccess = function() {
      resolve({
        code: 10000
      });
    };
    request.onerror = function(e) {
      reject({
        code: 0,
        msg: e.target.error
      });
    };
  });
}

/**
 * 获取 [db]--[tableName]下，主键为 [key] 的某条记录
 */
export function getRecord(key) {
  return new Promise(function(resolve, reject) {
    let request = db
      .transaction(TABLE)
      .objectStore(TABLE)
      .get(key);
    request.onsuccess = function(e) {
      resolve({
        code: 10000,
        data: e.target.result
      });
    };
    request.onerror = function(e) {
      reject({
        code: 0,
        msg: e.target.error
      });
    };
  });
}

/**
 * 读取 [db]--[tableName] 下的所有记录
 */
 export function readAllRecord() {
  return new Promise(function(resolve, reject) {
    let objectStore = db.transaction(TABLE).objectStore(TABLE);
    let records = [];
    objectStore.openCursor().onsuccess = function(e) {
      let cursor = e.target.result;
      if (cursor) {
        records.push(cursor.value);
        cursor.continue();
      } else {
        resolve({
          code: 10000,
          data: records
        });
      }
    };
    objectStore.openCursor().onerror = function(e) {
      reject({
        code: 0,
        msg: e.target.error
      });
    };
  });
}

/**
* 将 [db]--[tableName]中，主键为 [key]的数据为，更新为 [data]
*/
export function updateRecord(data, key) {
  return new Promise(function(resolve, reject) {
    let obj = {
      name: key,
      value: data
    };

    let request = db
      .transaction(TABLE, "readwrite")
      .objectStore(TABLE)
      .put(obj, key);
    request.onsuccess = function() {
      resolve({
        code: 10000
      });
    };
    request.onerror = function(e) {
      reject({
        code: 0,
        msg: e.target.error
      });
    };
  });
}

/**
  * 在 [db]--[tableName]下，删除主键为[key]的记录
*/
export function deleteRecord(key) {
  return new Promise(function(resolve, reject) {
    let request = db
      .transaction(TABLE, "readwrite")
      .objectStore(TABLE)
      .delete(key);
    request.onsuccess = function() {
      resolve({
        code: 10000
      });
    };
    request.onerror = function(e) {
      reject({
        code: 0,
        msg: e.target.error
      });
    };
  });
}