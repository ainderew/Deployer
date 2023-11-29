import sqlite3, {Database as SQLiteDatabase} from "sqlite3";
import { app } from "electron";
import path from "path";
import fs from "fs"

type Row = Record<string, any>; 
type QueryResult = Row[]; 

export let db:SQLiteDatabase;

const dbPath = path.join(app.getPath("userData"), "deployerDB.db")
console.log(dbPath)

if(fs.existsSync(dbPath)){
  db = new sqlite3.Database(dbPath)
  console.log("EXISTS")
  // try{
  //   await query("INSERT INTO Environment (sshCommand, name) VALUES ('sd', 'd')");
  // }catch(err){
  //   throw err;
  // }
}else{
  db = new sqlite3.Database(dbPath)
    try{
      await query("CREATE TABLE Environment (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,environmentName TEXT,sshCommand TEXT, projectName TEXT, projectDirectory TEXT, processManagerName TEXT, databaseName TEXT)");
    }catch(err){
      throw err;
    }
}


export function query(sql: string, params: any[] = []): Promise<QueryResult> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
