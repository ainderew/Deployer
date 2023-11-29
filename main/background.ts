import path from "path";
import { app, ipcMain, ipcRenderer } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { exec } from "child_process";
import util from "util";
import { shell } from "electron";

import { db, query } from "./DBHelpers/database";


const promiseExec = util.promisify(exec);
const isProd = process.env.NODE_ENV === "production";


if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}
let mainWindow:Electron.CrossProcessExports.BrowserWindow;
(async () => {
  await app.whenReady();

  mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("before-quit", () => {
  db.close();
});

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on("message", async (event, arg) => {
  event.reply("message", `${arg} World!`);
});

async function getAllBranches(sshCommand: string, projectDirectory:string) {

  const finalCommand =`${sshCommand} 'cd ${projectDirectory} && git fetch --all && git branch'`
  try {
    const { stdout } = await promiseExec(finalCommand);
    return stdout;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

 async function deploy(sshCommand:string,projectDirectory:string ,branchName: string, processManagerName:string) {
  const command = `${sshCommand} 'cd ${projectDirectory} && git checkout ${branchName} && git pull origin ${branchName} && source ~/.nvm/nvm.sh && npm run build && pm2 restart ${processManagerName}'`;
  try {
    const {stdout} = exec(command);
    stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      mainWindow.webContents.send("updateTerminal", data.toString());
    });

    stdout.on('end', () =>{
      mainWindow.webContents.send("updateTerminal", "Successfully Deployed! 🚀");
      mainWindow.webContents.send("updateTerminal", true);
      mainWindow.webContents.removeAllListeners("updateTerminal")
    })
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return error.message;
  }

}

async function restartProcess(sshCommand:string, projectDirectory:string, processManagerName:string) {
  const command = `${sshCommand} 'source ~/.nvm/nvm.sh && pm2 restart ${processManagerName}'`;
  try {
    const childProcess = exec(command);

    childProcess.stdout.on('data', (data) => {
      console.log("Sending")
      mainWindow.webContents.send("updateTerminal", data.toString());
     
    });

    childProcess.stdout.on('end', () =>{
      console.log("REMOVING LISTENER")
      mainWindow.webContents.send("updateTerminal", true);
      mainWindow.webContents.removeAllListeners("updateTerminal")
    })
    // return stdout
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

async function getActiveBranch(sshCommand:string, projectDirectory:string) {
  const command = `${sshCommand} 'cd ${projectDirectory} && git rev-parse --abbrev-ref HEAD'`;

  try {
    const { stdout } = await promiseExec(command);
    return stdout;

  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

async function openRemoteRepo(remoteURL:string) {
  try {
    shell.openExternal(remoteURL);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

async function getRemoteUrl(sshCommand:string, projectDirectory:string) {
  const command = `${sshCommand} 'cd ${projectDirectory} && git remote -v'`;

  try {
    const { stdout } = await promiseExec(command);
    return stdout
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

async function saveEnvironment(environmentName:string, sshCommand:string, projectName:string, projectDirectory:string, processManagerName:string, databaseName?:string) {
  if(!databaseName){
    await query(`INSERT INTO Environment (environmentName, sshCommand, projectName, projectDirectory, processManagerName) VALUES ('${environmentName}', '${sshCommand}', '${projectName}', '${projectDirectory}', '${processManagerName}')`);
    return;
  }

  await query(`INSERT INTO Environment (environmentName, sshCommand, projectName, projectDirectory, processManagerName, databaseName) VALUES ('${environmentName}', '${sshCommand}', '${projectName}', '${projectDirectory}', '${processManagerName}', '${databaseName}')`);
  try {
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}
async function getEnvironments() {
  try{
    const res = await query(`SELECT id, environmentName, sshCommand, projectName, projectDirectory, processManagerName  FROM Environment`);
    return res;
  }catch(err){
    throw err;
  }
}


ipcMain.handle("deployBranch", (_, [sshCommand,projectDirectory,branchName, processManagerName]) => deploy(sshCommand,projectDirectory,branchName, processManagerName));
ipcMain.handle("restartProcess", (_, [sshCommand,branchName, processManagerName]) => restartProcess(sshCommand,branchName, processManagerName));
ipcMain.handle("getActiveBranch", (_, [sshCommand, projectDirectory]) =>getActiveBranch(sshCommand, projectDirectory));
ipcMain.handle("getAllEnvironments", getEnvironments);
ipcMain.handle("getBranches", (_, [sshCommand, projectDirectory]) => getAllBranches(sshCommand, projectDirectory));
ipcMain.handle("getRemoteUrl", (_,[sshCommand, projectDirectory]) =>getRemoteUrl(sshCommand, projectDirectory));
ipcMain.handle("openRemoteRepo", (_,[remoteUrl]) =>openRemoteRepo(remoteUrl));
ipcMain.handle("saveEnvironment",(_,[environmentName, sshCommand, projectName, projectDirectory, processManagerName]) => saveEnvironment(environmentName, sshCommand, projectName, projectDirectory, processManagerName));
